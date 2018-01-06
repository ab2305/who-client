import _ from 'lodash'
import moment from 'moment'
import config from './../../config/config-dev'

import React, { Component } from 'react'
import { AsyncStorage, Clipboard, DeviceEventEmitter, FlatList, Image, NativeModules, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image';

import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import { Actions, Bubble, Send, GiftedChat } from 'react-native-gifted-chat'

import RNUploader from 'react-native-uploader';
import ReversedFlatList from './../../lib/ReversedList';
import Button from './../../components/Button'
import Alert from './../../utils/Alert'

import Theme from './../../config/styles'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import firebase from './../../base/Firebase'


export default class Chat extends Component {
	
	static navigationOptions = ({ navigation }) => ({
		
		title: `${navigation.state.params.user}`,
		headerStyle: {
			backgroundColor: Theme.defaultPrimaryColor,
			
		},
		headerTintColor: 'white',
		
		
	})
	

	componentDidMount() {
        this.props.navigation.setParams({
            handleSetting: this.showActionSheet
        });
    }

	
   getActionSheetRef = ref => (this.actionSheet = ref)

	constructor(props) {
		super(props)

		this.type = ''
		this.topic = this.props.navigation.state.params.topic
		this.otherPerson = this.props.navigation.state.params.user
		this.enableEndReached = false;
		this.page = 1

		this.state = {
			list: [],
			text: '',
			loggedInfo: {}
		}
		this.store = this.props.navigation.state.params.store

		this.compositSubscription = []

		this._initChatList = this._initChatList.bind(this)

		this._fetchChatList = this._fetchChatList.bind(this)
		this._fetchChatListOnNext = this._fetchChatListOnNext.bind(this)
		this._fetchChatListOnError = this._fetchChatListOnError.bind(this)
		this._fetchChatListOnCompleted = this._fetchChatListOnCompleted.bind(this)

		this._handleOnIconPressed = this._handleOnIconPressed.bind(this)
		this._renderCustomActions = this._renderCustomActions.bind(this)

		this._appendChat = this._appendChat.bind(this)
		this._doUpload = this._doUpload.bind(this)
		this._mapResponse = this._mapResponse.bind(this)
		this._rawMapResponse = this._rawMapResponse.bind(this)
		this._renderTime = this._renderTime.bind(this)
		//this.showActionSheet = this.showActionSheet.bind(this)
		
		this._initChatList()
	}
	

	async _initChatList() {
		try {
			console.log('init chat list')
			const value = await AsyncStorage.getItem('loginInfo')
			const loggedInfo = JSON.parse(value)
			this.loggedInfo = loggedInfo
			console.log('in init Chat List, loggedInfo = ', this.loggedInfo)
			this.type = loggedInfo.type // email or invitee
			this.setState({ 'loggedInfo': loggedInfo })

			let subscription = this._fetchChatList(this.page)
			this.compositSubscription.push(subscription)
		} catch (error) {
			console.log(error)
		}
	}
	
	showActionSheet = () => {
		Alert('','action');
	    this.ActionSheet.show()
	  }
	 
	  handlePress(i) {
	    this.setState({
	      selected: i
	    })
	  }


	_mapResponse(res) {
		return _.isArray(res.data) ? _.map(res.data, this._rawMapResponse) : this._rawMapResponse(res.data)
	}

	_rawMapResponse(item) {
		return {
			_id: item.id,
			text: (item.text) ? item.text : null,
			image: (item.fileId) ? item.file.url : null,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			chatId: item.chatId,
			inviteeId: item.inviteeId,
			isRead: item.isRead,
			file: item.file,
			user: {
				_id: (item.inviteeId) ? 1 : 2,
				name: this.otherPerson,
				avatar: null
			},
		}
	}

	_fetchChatList(page = 1) {
		// 0번 인덱스가 가장 최근 아이템
		return HttpRequestFactory.createRxRestClient('/chats/' + this.props.navigation.state.params.id + '/messages?limit=30&page=' + page, HttpRequestFactory.GET)
			.subscribe(this._fetchChatListOnNext(), this._fetchChatListOnError(), this._fetchChatListOnCompleted())
	}

	_fetchChatListOnNext() {
		return (res) => {
			return this.setState(
			{ 'list': [...this.state.list, ...this._mapResponse(res)] }
		)}
	}

	_fetchChatListOnError() {
		return (error) => {
			console.log('error', error)
		}
	}

	_fetchChatListOnCompleted() {
		return () => {
			console.log('completed')
		}
	}

	async _handleOnIconPressed() {
		const options = {
      title: '이미지 선택',
      takePhotoButtonTitle: '사진 촬영',
      cancelButtonTitle: '취소',
      chooseFromLibraryButtonTitle: '갤러리에서 선택',
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};
		ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				return
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error)
				return
			}

			let source = { uri: response.uri }
			this._doUpload(response)
		});

	}

	_doUpload(file) {
		let files = [
			{
				name: 'file',
				filename: file.fileName,
				filepath: file.uri,
				filetype: file.type,
			},
		]

		let opts = {
			url: config.api.url + '/file',
			files: files,
			method: 'POST',
		}

		RNUploader.upload(opts, (err, response) => {
			if (err) {
				console.log(err);
				return;
			}

			var res;
			if (_.has(response, 'data')) {
				res = JSON.parse(response.data);
			} else {
				res = JSON.parse(response);
			}

			console.log('response: ', res);

			const url = this.type === 'email' ? 'user/message' : 'invitee/message'
			let subscription = HttpRequestFactory.createRxRestClient(url, HttpRequestFactory.POST, {
				topic: this.topic,
				text: '',
				fileId: res.id
			})
				.subscribe(
					res => {
						this.setState((previousState) => ({
							list: GiftedChat.append(previousState.list, [this._mapResponse(res)]),
						}))
					},
					err => console.log(err)
				)
			this.compositSubscription.push(subscription)
		})
	}

	async _appendChat(id) {
    let subscription = HttpRequestFactory.createRxRestClient('/messages/' + id, HttpRequestFactory.GET)
      .subscribe(res => {
        this.setState({
					list: [this._mapResponse(res), ...this.state.list]
        })
      })

    this.compositSubscription.push(subscription)
  }

	onSend(messages = []) {
		messages.forEach(message => {
			const url = this.type === 'email' ? 'user/message' : 'invitee/message'
			let subscription = HttpRequestFactory.createRxRestClient(url, HttpRequestFactory.POST, {
				topic: this.topic,
				text: message.text,
			})
				.subscribe(res =>{
					this.store.updateStampCount(res.data.stamp)
					console.log('stamp count = ', res.data.stamp)
					if(res.data.stamp === 1) {
						Alert('마지막 우표만 남았습니다. 이제 문자를 단 한번만 보낼 수 있습니다.')
					}
					this.setState((previousState) => ({
						list: GiftedChat.append(previousState.list, messages),
					}))
				},
				error => Alert('전송에 실패했습니다. 남은 우표 개수를 확인하세요.')
			)
			this.compositSubscription.push(subscription)
		})
	}

	_renderAutoHeightImage(props) {
		console.log('props: ' + props)
		return (
			<AutoHeightImage width={200}
				imageURL={props.currentMessage.image} />
		)
	}

	_renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Theme.talkYouMessageColor,
          },
          right: {
            backgroundColor: Theme.talkMeMessageColor,
          }
        }}
      />
    );
	}

	_renderCustomActions(props) {
		const takeAction = this._handleOnIconPressed
		const options = {
      '이미지 첨부하기': (props) => {
        takeAction()
      },
      '취소': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    )
	}

	_renderTime(props) {
		const time = moment(props.currentMessage.createdAt).format('LT')
		const isRead = props.currentMessage.isRead
		const currentUser = this.loggedInfo.type === 'invitee' ? 1 : 2
		console.log('----')
		console.log(this.loggedInfo)
		console.log('-', isRead, props.currentMessage)
		console.log('----')


		return (
			<View style={styles.footerContainer}>
				<Text style={props.currentMessage.user._id == currentUser ? styles.footerText : styles.footerText2}>
					{isRead || props.currentMessage.user._id != currentUser ? time : '안 읽음 ' + time}
				</Text>
			</View>
		)
	}

	_renderSend = (props) => {
		return (
			<Send {...props} label={'전송'}>
			</Send>
		)
	}

	onEndReached = () => {
		console.log('onEndReached')
		if (!this.enableEndReached) {
			this.enableEndReached = true;
			return
		}

		this._fetchChatList(this.page + 1)
		this.page += 1
	}

	_onLongPress = (context, message) => {
	
		console.log(message)
		if(message.user._id == '1') {
			const options = ['텍스트 복사', '신고', '취소'];
		    const cancelButtonIndex = options.length - 1;
		    context.actionSheet().showActionSheetWithOptions({
		      options,
		      cancelButtonIndex,
		    	},
					buttonIndex => {
						switch (buttonIndex) {
							case 0:
								if(message.text) {
									Clipboard.setString(message.text)
								}
								break;
							case 1:
								Alert('', '상대방을 신고하시겠습니까?', '신고', false, true, '취소')
								.subscribe(
									(res) => {
										if (message.text == '신고된 내용입니다.') {
											alert('이미 신고된 내용입니다.')
											return
										}
										const meObservable = HttpRequestFactory.createRxRestClient('/Report/', HttpRequestFactory.POST, {
											chartID: message.chatId,
											text: message.text,
											id: message._id
										})
										.subscribe(
											(res) => {
												console.log('fetchMedata = ', res.data)
												Alert('신고되었습니다.')
												//this.store.refresh()
											},
											(err) => {
												console.log(err)
												Alert('신고가 실패되었습니다.')
											}
										)
										console.log('신고')
										//this.doInviteTransaction(res.data, user.phone)
									},
									(err) => {
										if(err == 'cancel') {
											
											return
										}
										
									}
								)
								break;
							/*case 2:
								Alert('', '상대방을 차단하시겠습니까?', '차단', false, true, '취소')
								.subscribe(
									(res) => {
										
										const meObservable = HttpRequestFactory.createRxRestClient('/blocking/'+ message.chatId, HttpRequestFactory.GET)
										.subscribe(
											(res) => {
												console.log('fetchMedata = ', res.data)
												Alert('차단되었습니다..')
												//this.store.refresh()
												this.navigation.navigate({routeName:'ChatList'});
											},
											(err) => {
												console.log(err)
												Alert('차단이 실패되었습니다.')
											}
										)
										console.log('차단')
										//this.doInviteTransaction(res.data, user.phone)
									},
									(err) => {
										if(err == 'cancel') {
											
											return
										}
										
									}
								)
								break;*/
							default:
						}
					}
				)

		} else {
			const options = ['텍스트 복사', '취소'];
		    const cancelButtonIndex = options.length - 1;
		    context.actionSheet().showActionSheetWithOptions({
		      options,
		      cancelButtonIndex,
		    	},
					buttonIndex => {
						switch (buttonIndex) {
							case 0:
								if(message.text) {
									Clipboard.setString(message.text)
								}
								break;
							default:
						}
					}
				)

		}
		
	}


	render() {
		return (
			<View style={styles.chatContainer}>
				<GiftedChat
					messages={this.state.list}
					placeholder={this.state.list.length == 0 ? '첫 메시지를 입력해주세요 !': '메시지를 입력해주세요'}
					onSend={(messages) => this.onSend(messages)}
					locale='ko'
					user={{
						_id: this.state.loggedInfo.type === 'invitee' ? 1 : 2,
					}}
					listViewProps = {{
						onEndReached: this.onEndReached
					}}
					onLongPress={this._onLongPress}
					renderMessageImage={this._renderAutoHeightImage}
					renderBubble={this._renderBubble}
					renderSend={this._renderSend}
					renderTime={this._renderTime}
					renderActions={this._renderCustomActions}
				/>
				
			</View>
		)
	}

	componentDidMount() {
		this.onMessageReceiver = (message) => {
			console.log(message)
			if (!message.category) {
				return
				console.log(1)
			}

			if (this.type == message.userType) {
				console.log('equals type')
				return
			}

			console.log('re render...')
			this._appendChat(message.id)
		}
		firebase.messaging().onMessage(this.onMessageReceiver)

		DeviceEventEmitter.addListener('RNUploaderProgress', (data) => {
			let bytesWritten = data.totalBytesWritten
			let bytesTotal = data.totalBytesExpectedToWrite
			let progress = data.progress

			console.log("upload progress: " + progress + "%")
		})
	}

	componentWillUnmount() {
		console.log('unmount')
		this.onMessageReceiver = undefined
		this.compositSubscription.forEach(subscription => subscription.dispose())
	}
}

const styles = StyleSheet.create({
	chatContainer: {
		height: '100%',

		backgroundColor: 'white', // 스크롤 영역과 배경 일치 시키기
	},

	// 스크롤에 flex:1 을 주면, 영역이 고정되어서 스크롤이 먹히지 않는다.
	scrollStyle: {
		backgroundColor: Theme.talkBackgroundColor,
	},

	chatTextInput: {
		flex: 1
	},

	footerContainer: {
		marginLeft: 10,
		marginRight: 10,
	},
	footerText: {
		fontSize: 12,
		color: Theme.defaultBackgroundColor2,
	},

	footerText2: {
		fontSize: 12,
		color: Theme.thirdTextColor,
	},
	btnStyle: {
		width: 50,
		
	},
})
