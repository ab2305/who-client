import _ from 'lodash'
import moment from './../../../node_modules/moment/min/moment-with-locales.min.js'

import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, Text, FlatList, View, ScrollView, Image,TouchableOpacity, TouchableHighlight, Platform } from 'react-native'
import { Icon, List } from 'react-native-elements'

import Alert from './../../utils/Alert'
import Button from './../../components/Button'
import Theme from './../../config/styles'

import { observer } from 'mobx-react/native'
import chatListStore from './../../stores/ChatListStore'
import CombinedButton from 'react-native-combined-button'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import firebase from './../../base/Firebase'

const messageSkeleton = {
	topic: '', createdAt: '', updatedAt: '', inviteeId: -1, userId: -1,
	chatUserName: '', phone: '',
	messages: {
		'id': -1,
		'text': '',
		'isRead': false,
		'createdAt': null,
		'updatedAt': null,
		'chatId': -1,
		'inviteeId': -1,
		'userId': null,
		'fileId': null
	},
	time: '',
	chatOn: false,
}

class ChatListComponent extends Component {
	constructor(props) {
		super(props)

		this.compositSubscription = []
		this.store = this.props.store

		this.navigation = this.props.navigation

		this.inviteUser = this.inviteUser.bind(this)
		this.doChat = this.doChat.bind(this)

		this._renderView = this._renderView.bind(this)
		this._renderChat = this._renderChat.bind(this)
		this._renderChatDetail = this._renderChatDetail.bind(this)
		this._renderInvitationDetail = this._renderInvitationDetail.bind(this)
	}

	inviteUser() {
		console.log(this.store)
		this.navigation.navigate('Invite', { store: this.store });

	}

	doChat(id, topic, name) {
		return () => {
			return this.navigation.navigate('Chat', { id, topic, user: name, store: this.store })
		}
	}

	_fetchMeData = async () => {
		const InitData = async (res) => {
			const value = await AsyncStorage.getItem('WhoClient@baseData')
			if(value === null) {
				console.log('value is null')
				const data = {
					lastReadNoticeId: 0,
				}

				await AsyncStorage.setItem('WhoClient@baseData', JSON.stringify(this.data))
			}
		}

		const meObservable = HttpRequestFactory.createRxRestClient('/me', HttpRequestFactory.GET)
			.subscribe(
				(res) => {
					console.log('fetchMedata = ', res.data)
					initData(res)
				},
				(err) => {
					console.log('me error')
				}
			)
	}

	alert(item) {
		return () => {
			const user = item

			console.log({phone: user.phone, name: user.chatUserName })
			const inviteObservable = HttpRequestFactory.createRxRestClient(
				'/invitee', HttpRequestFactory.POST,
				{ phone: user.phone, name: user.chatUserName }
			)

			const alertObservable = Alert('대화 초대',
					user.chatUserName + `님께 대화초대 메시지를 보냅니다.
${user.chatUserName}님이 초대를 수락하여 ‘누굴까’를 설치하면 회원님께 알려드리고 곧바로 채팅을 시작할 수 있습니다
‘확인’ 버튼을 누르면 ${user.chatUserName}님이 처음 보게 될 메시지를 입력하실 수 있습니다.
메시지 1건을 보낼 때마다 우표 1매가 차감되며 스토어에서 우표 또는 무제한 이용권을 구매할 수 있습니다`,
					'확인', false, true, '취소'
				);

			Alert('대화 초대',
					user.chatUserName + `님께 대화초대 메시지를 보냅니다.
${user.chatUserName}님이 초대를 수락하여 ‘누굴까’를 설치하면 회원님께 알려드리고 곧바로 채팅을 시작할 수 있습니다
‘확인’ 버튼을 누르면 ${user.chatUserName}님이 처음 보게 될 메시지를 입력하실 수 있습니다.
메시지 1건을 보낼 때마다 우표 1매가 차감되며 스토어에서 우표 또는 무제한 이용권을 구매할 수 있습니다`,
					'확인', false, true, '취소'
				)
				.flatMap(result => inviteObservable)
				.subscribe(
					(res) => {
						console.log('in doInviteTransaction1')
						this.doInviteTransaction(res.data, user.phone)
					},
					(err) => {
						if(err == 'cancel') {
							Alert('', '취소되었습니다.')
							return
						}
						if(err.response.status == 400) {
							Alert('', '더 이상 대화초대 메시지를 보낼 수 없습니다. 대화초대 메시지는 누구친별로 최대 2번까지만 보낼 수 있습니다.')
							return
						}

						console.log(err)

						Alert('', '초대 중 에러가 발생했습니다. 번호가 잘못되지 않았는지 확인해보세요.')
					}
				)
		}
	}
	
	alert1(item) {
		return () => {
			const user = item

			console.log({phone: user.phone, name: user.chatUserName })
			


			
			Alert('', `선택된 대화를 삭제하시겠습니까?`, '삭제', false, true, '취소')
			
				.subscribe(
					(res) => {
					const meObservable = HttpRequestFactory.createRxRestClient('/block/'+ user.id, HttpRequestFactory.GET)
						.subscribe(
							(res) => {
								console.log('fetchMedata = ', res.data)
								Alert('삭제되었습니다.')
								this.store.refresh()
							},
							(err) => {
								console.log(err)
								Alert('삭제가 실패되었습니다.')
							}
						)
						console.log(user.topic)
						console.log('in delete')
						//this.doInviteTransaction(res.data, user.phone)
					},
					(err) => {
						if(err == 'cancel') {
							Alert('', '취소되었습니다.')
							return
						}
						
					}
				)
		}
	}

	doInviteTransaction = async (data, phoneNumber) => {
		console.log('in doInviteTransaction2')
		const rawFriends = await AsyncStorage.getItem('friends')
		if (rawFriends === null) {
			return
		}

		const rawMyFriends = await AsyncStorage.getItem('myFriends')
		if (rawMyFriends === null) {
			return
		}

		const parsedFriends = JSON.parse(rawFriends)
		const parsedMyFriends = JSON.parse(rawMyFriends)

		const updatedFriends = _.remove(parsedFriends, item => {
			if (item.phone == phoneNumber) {
				console.log('lanace:: 999', item)
				_.concat(rawMyFriends, item)
				console.log('lanace:: 998', rawMyFriends)
			}

 			return item.phone == phoneNumber
		})

		// warn: pop firend data saved local store
		await AsyncStorage.setItem('friends', JSON.stringify(parsedFriends))
		await AsyncStorage.setItem('myFriends', JSON.stringify(rawMyFriends))
		
		this.store._fetch()
		this.doChat(data.id, data.topic, data.name)()
	}

	_renderChat() {
		return (row) => {
			console.log('render row')
			const item = row.item
			if(item.chatOn) {
				return this._renderChatDetail(item)
			}
			return this._renderInvitationDetail(item)
		}
	}

	_renderInvitationDetail(item) {
		return (
			<View
				key={item.id}
				style={styles.invitationRowContainer}>
				<Text style={styles.itemName}>
					{item.chatUserName}
				</Text>
				<Button btnText="대화초대" customStyle={styles.btnStyle} onPress={this.alert(item)} />
				
ㅋ		</View>
		)
	}

	_renderChatDetail(item) {
		const createdAt = item.messages.createdAt ?
			moment(item.messages.createdAt).locale('ko').fromNow() : '-'
		const isFirst = !item.hasInviteeMessage

		return (
			<TouchableOpacity
				key={item.id}
				style={styles.chatRowContainer}
				onPress={this.doChat(item.id, item.topic, item.chatUserName)}>
				<Text style={styles.itemName}>
					{item.chatUserName}
				</Text>
				<Text style={styles.itemContent} numberOfLines={1}>
					{item.messages.text}
				</Text>
				{
					isFirst && 
					<Button btnText="대화초대" customStyle={styles.btnStyle} onPress={this.alert(item)} />
				}
				{
					!isFirst &&
					<Text style={styles.itemTime}>{createdAt}</Text>
					
					
				}
				
				
				<TouchableHighlight onPress={this.alert1(item)}>
		            <Image style={styles.imgstyle} source={require('./../../images/delete.png')} />
		         </TouchableHighlight>
				
			</TouchableOpacity>
		)
	}

	_renderView() {
		let itemInfo = this.store.loggedInfo ? this.store.loggedInfo.item : undefined

		const isSubscribed = itemInfo ? itemInfo.subscribed : false

		console.log('subscribed = ', isSubscribed)
		const subscriptionEndDate = itemInfo && isSubscribed ?
		moment(itemInfo.subscriptionStartedAt).format('L') : '-'

		if (this.store.chatList.length !== 0) {
			// : this._renderInvitationDetail(item)
			return (
				<ScrollView>
					<View style={styles.header}>
						<Text style={styles.listTitle}>누구친 ({this.store.chatList.length})</Text>
						<View style={styles.subHeader}>
							<Text style={styles.subHeaderText}>보유 우표 : {this.store.stampCount}</Text>
							<Text style={styles.subHeaderText}>무제한 이용 : {subscriptionEndDate}</Text>
						</View>
					</View>
					<FlatList
						data={ this.store.chatList }
						renderItem={ this._renderChat() }
					/>
				</ScrollView>
			)
		} else {
			return (
				<View>
					<View style={styles.header}>
						<View/>
						<View style={styles.subHeader}>
							<Text style={styles.subHeaderText}>보유 우표 : {this.store.stampCount}</Text>
							<Text style={styles.subHeaderText}>무제한 이용 : {subscriptionEndDate}</Text>
						</View>
					</View>
					<View style={styles.noticeContainer}>
						<Text style={styles.notice}>
							익명으로 채팅을 하고 싶은 상대가 있다면{'\n'}
							먼저 아래의 '친구추가' 버튼을 눌러서{'\n'}
							대화상대(누구친)을 등록해 주세요.
						</Text>
					</View>
				</View>
			)
		}
	}

	render() {
		console.log('-count = ', this.store.stampCount)
		return (
			<View style={styles.chatContainer}>
				{this._renderView()}
				{
					this.store.type && this.store.type === 'email' &&
					<Icon
						raised
						reverse
						name='add'
						size={30}
						color={Theme.accentColor}
						containerStyle={styles.fab}
						onPress={this.inviteUser} />
				}
			</View>
		)
	}

	componentDidMount() {
		// this._fetch()
		this.store._fetch()
		firebase.messaging().onMessage(() => this.store._fetch())

		if(Platform.OS === 'ios') {
			firebase.messaging().requestPermissions();
		}

		this._fetchMeData()
	}
}

const styles = StyleSheet.create({
	chatRowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',

		paddingTop: 25,
		paddingRight: 20,
		paddingBottom: 25,
		paddingLeft: 15,

		borderBottomWidth: 0.5,
		borderColor: 'gray',
	},

	invitationRowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',

		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,

		borderBottomWidth: 0.5,
		borderColor: 'gray',
	},

	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
	},

	subHeader: {
		flexDirection: 'column',
		paddingRight: 15,
	},

	subHeaderText: {
		alignSelf: 'flex-end',
		fontSize: 11,
		color: Theme.secondaryTextColor,
		paddingRight: 10,
	},

	itemName: {
		width: 70,

		color: 'black',
		fontWeight: 'bold'
	},
	itemContent: {
		flex: 1,
	},

	itemTime: {
		marginRight : 10,
		textAlign: 'right',
	},

	chatContainer: {
		flex: 1,
		paddingTop: 10,
		backgroundColor: 'white',
	},

	noticeContainer: {
		marginTop: 14,
	},
	notice: {
		color: Theme.defaultPrimaryColor,
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
	},

	listStyle: {
		flexDirection: 'row',
		alignItems: 'center',

		height: 60,
	},

	listTitle: {
		fontSize: Theme.fontMediumLarge,
		fontWeight: 'bold',
		alignSelf: 'center',
		// listItem에 기본 padding or margin이 들어감. 그러나, web처럼 추적을 할 수 없어서 임의로 margin을..
		marginRight: 15,
		marginLeft: 15,
	},

	fab: {
		position: 'absolute',
		right: 15,
		bottom: 15,
	},

	btnStyle: {
		height: 30,
		backgroundColor: Theme.defaultPrimaryColor,
	},
	
	
	imgstyle : {
		width : 25,
		height : 25,
		backgroundColor : '#fff',
	}
	
	
})


const OChatList = observer(ChatListComponent)

@observer
export default class ChatList extends Component {
	render() {
		return <OChatList navigation={this.props.navigation} store={chatListStore} />
	}
}
