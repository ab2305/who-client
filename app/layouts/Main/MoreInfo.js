import React, { Component } from 'react'
import { AsyncStorage, Image, View, Text, TouchableHighlight, StyleSheet, ScrollView } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Theme from './../../config/styles'
import Alert from './../../utils/Alert'

import HttpRequestFactory from './../../base/HttpRequestFactory'

export default class MoreInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {}
		this.navigation = this.props.navigation
		this._init()
	}

	_init = async () => {
		const value = await AsyncStorage.getItem('loginInfo')
		const loggedInfo = JSON.parse(value)
		this.userId = loggedInfo.id
		this.type = loggedInfo.type // email or invitee

		console.log('in init',this.userId)
	}

	_onNoticePressed = () => this.navigation.navigate('Notice')

	_onMessagePressed = () => this.navigation.navigate('DirectMessage')

	_onFaqPressed = () => this.navigation.navigate('Faq')

	_onQuestionPressed = () => this.navigation.navigate('Question')

	_onGuidePressed = () => this.navigation.navigate('Guide', { loggedIn: true })

	_onPrivacyPressed = () => {
		if(this.type === 'email') {
			this.navigation.navigate('Privacy')
			return
		}
		Alert('', '누구친은 회원 정보 관리 기능을 이용할 수 없습니다.')
	}

	_onLogoutPressed = () => {
		console.log('_onLogoutPressed')
		AsyncStorage.removeItem('friends', err => {
		})
		AsyncStorage.removeItem('loginInfo', (err) => {
			console.log('removed')

			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: 'Login' })
				]
			})
			this.props.navigation.dispatch(resetAction)
		})
	}

	_onSettingPressed = () => this.navigation.navigate('Settings')


	_fetchMeData = async () => {
		const value = await AsyncStorage.getItem('WhoClient@baseData')
		let baseData = JSON.parse(value)

		baseData = baseData ? baseData : {
			lastReadNoticeId: 0,
		}

		console.log('in componentDidMount => fetchMedata', baseData)
		try {

			console.log('in componentDidMount => fetchMedata start', baseData.lastReadNoticeId)
			const res = await HttpRequestFactory.createRestClient('/me', HttpRequestFactory.GET)
			console.log('in componentDidMount => fetchMedata end', res.data.lastNoticeId > baseData.lastReadNoticeId)
			console.log('in componentDidMount => hasUnreadNotes',  res.data.hasUnreadNotes)

			this.setState(
				{
					needLastNoticeRead : res.data.lastNoticeId > baseData.lastReadNoticeId,
					hasUnreadNote : baseData.hasUnreadNotes
				}
			)


		} catch (err) {
			console.log(err)
		}
	}

	render() {
		return (
			<View style={styles.moreInfoContainer}>
				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor} style={styles.itemContainer} onPress={this._onNoticePressed} >
					<Text style={styles.text}>공지사항 { this.state.needLastNoticeRead && <Text style={styles.newText}>N</Text>}</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onMessagePressed}>
					<Text style={styles.text}>누굴까 메시지 { this.state.hasUnreadNote && <Text style={styles.newText}>N</Text>}</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onFaqPressed}>
					<Text style={styles.text}>자주 묻는 질문</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onQuestionPressed}>
					<Text style={styles.text}>1:1 문의하기</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onGuidePressed}>
					<Text style={styles.text}>누굴까 사용방법</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onPrivacyPressed}>
					<Text style={styles.text}>회원 정보 관리</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onLogoutPressed}>
					<Text style={styles.text}>로그아웃</Text>
				</TouchableHighlight>
				<View style={styles.hr} />

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor}  style={styles.itemContainer} onPress={this._onSettingPressed}>
					<Text style={styles.text}>설정</Text>
				</TouchableHighlight>
				<View style={styles.hr} />
			</View>
		)
	}

	componentDidMount() {
		console.log('in componentDidMount, fetchData..')
		this._fetchMeData()
	}
}

const styles = StyleSheet.create({
	moreInfoContainer: {
		flex: 1,
		backgroundColor: 'white', // 스크롤 영역과 배경 일치 시키기
	},

	hr: {
		borderBottomColor: Theme.dividerColor,
		borderBottomWidth: 1,
	},

	itemContainer: {
		width: '100%',
		height: 44,
		paddingLeft: 16,
		justifyContent: 'center'
	},

	text: {
		fontSize: 16,
	},

	newText: {
		fontSize: 12,
		color: 'red',
	},

	// 스크롤에 flex:1 을 주면, 영역이 고정되어서 스크롤이 먹히지 않는다.
	scrollStyle: {
		backgroundColor: Theme.talkBackgroundColor,
	},

	chatTextInput: {
		flex: 1
	},
})
