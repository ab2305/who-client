import _ from 'lodash'
import React, { Component } from 'react'
import { AsyncStorage, ScrollView, Text, View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import { FormLabel, FormInput } from 'react-native-elements'
import SplashScreen from 'react-native-splash-screen'

import Button from '../../components/Button'
import Input from '../../components/Input'

import Theme from './../../config/styles'
import Alert from './../../utils/Alert'

import HttpRequestFactory from './../../base/HttpRequestFactory'
import firebase from './../../base/Firebase'

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			checked: false,
			email: '',
			password: '',
			type: '',
			phone: '',
			code: '',
		}
		this.useAutoLogin = false
		this.compositSubscription = []

		this.navigation = this.props.navigation
		this.login = this.login.bind(this)
		this.inviteeLogin = this.inviteeLogin.bind(this)
		this.attemptAutoLogin = this.attemptAutoLogin.bind(this)

		this.loginSubscriberOnNext = this.loginSubscriberOnNext.bind(this)
		this.loginSubscriberOnError = this.loginSubscriberOnError.bind(this)
		this.loginSubscriberOnCompleted = this.loginSubscriberOnCompleted.bind(this)
	}
	
	onTermPressed = () => {
		this.props.navigation.navigate('Terms')
	}

	componentDidMount() {
		this.attemptAutoLogin()
	}

	async attemptAutoLogin() {
		try {
			const value = await AsyncStorage.getItem('loginInfo')
			if(value === null) {
				console.log('value is null')
				return
			}

			const loggedInfo = JSON.parse(value)
			console.log(loggedInfo)

			let subscription = (loggedInfo.type === 'email') ?
				HttpRequestFactory.createRxRestClient('/user/login', HttpRequestFactory.POST, loggedInfo)
					.subscribe(this.loginSubscriberOnNext('auto'), this.loginSubscriberOnError(), this.loginSubscriberOnCompleted())
				:
				HttpRequestFactory.createRxRestClient('/invitee/login', HttpRequestFactory.POST, loggedInfo)
					.subscribe(this.loginSubscriberOnNext('auto'), this.loginSubscriberOnError(), this.loginSubscriberOnCompleted())

			this.compositSubscription.push(subscription)
		} catch (err) {
			console.log(err)
		}
	}

	login() {
		this.setState({ 'type': 'email' }, () => {
			const data = _.pick(this.state, ['email', 'password', 'type'])
			console.log(this.state, data)
			let subscription = HttpRequestFactory.createRxRestClient('/user/login', HttpRequestFactory.POST, data)
				.subscribe(
					this.loginSubscriberOnNext('manual', true),
					this.loginSubscriberOnError(),
					this.loginSubscriberOnCompleted()
				)

			this.compositSubscription.push(subscription)
		})
	}

	inviteeLogin() {
		if (!this.state.checked) {
				Alert('', '이용 약관에 동의해주세요')
				return
			}
		this.setState({ 'type': 'invitee' }, () => {
			const data = _.pick(this.state, ['phone', 'code', 'type'])
			let subscription = HttpRequestFactory.createRxRestClient('/invitee/login', HttpRequestFactory.POST, data)
				.subscribe(this.loginSubscriberOnNext('manual', false, data.code), this.loginSubscriberOnError(), this.loginSubscriberOnCompleted())
			this.compositSubscription.push(subscription)
		})
	}

	loginSubscriberOnNext(type, isUser, code) {
		return (res) => {
			console.log('loginSubscriberOnNext', res.data)
			const loggedInfo = res.data
			loggedInfo.password = this.state.password
			console.log(loggedInfo)

			if(type === 'manual') {
				loggedInfo.code = code
				loggedInfo.type = isUser ? 'email' : 'invitee'
				console.log(loggedInfo)
				AsyncStorage.setItem('loginInfo', JSON.stringify(loggedInfo), (err) => {
					console.log(err)
				})
			}

			firebase.messaging().subscribeToTopic('notice')
			firebase.messaging().subscribeToTopic(
				loggedInfo.type === 'email' ? 'user_' + loggedInfo.id : 'invitee_' + loggedInfo.id
			)

			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: 'Main' })
				]
			})
			this.props.navigation.dispatch(resetAction)
		}
	}

	loginSubscriberOnError() {
		return (err) => {
			console.log(err)
			Alert('', '로그인에 실패했습니다. \n아이디와 패스워드를 확인해주세요.')
		}
	}

	loginSubscriberOnCompleted() {
		return () => this.compositSubscription.forEach(subscription => subscription.dispose())
	}

	render() {
		return (
			<ScrollView contentContainerStyle={styles.loginContainer} ref='scroll'>
				<KeyboardAvoidingView behavior="position" style={ styles.loginContainer }>
				<View style={styles.noticeContainer}>
					<Text style={[styles.notice, styles.noticeHeader]}>
						대화 초대 문자를 받고 오셨나요?
					</Text>
					<Text style={styles.notice}>
						그렇다면 회원가입 할 필요 없이 아래의 누구친으로{'\n'}
						로그인하면 초대한 사람과 바로 채팅할 수 있습니다.{'\n'}
						처음 받으셨던 대화초대 문자에 포함된{'\n'}
						코드번호(4자리 숫자)를 확인 해 주세요.
					</Text>
				</View>
				<View style={styles.flex}>
						<CheckBox
							title='이용약관 및 개인정보 취급방침에 동의합니다'
							checked={this.state.checked}
							containerStyle={styles.checkbox}
							textStyle={styles.checkboxText}
							onPress={() => { this.setState({ checked: !this.state.checked }) }}
						/>
						<Text style={{ fontWeight: 'bold', fontSize: Theme.fontMediumSmall }} onPress={this.onTermPressed}>[보기]</Text>
					</View>
				<View style={styles.friendLoginInputContainer}>
					<FormInput
						keyboardType='phone-pad'
						placeholder="'-' 없이 휴대폰 번호를 입력하세요."
						onChangeText={(phone) => this.setState({phone})}
					/>
					<FormInput
						keyboardType='phone-pad'
						placeholder="4자리 초대 코드를 입력하세요."
						onChangeText={(code) => this.setState({code})}
					/>
				</View>
				<View style={styles.inviteeLogin}>
					<Button btnText="대화초대 입장하기" style={styles.button} onPress={this.inviteeLogin}></Button>
				</View>

				<View style={styles.noticeContainer}>
					<Text style={styles.notice}>
						누굴까의 회원가입과 누굴까 회원의 로그인은 아래 부분을 이용해 주세요.
					</Text>
				</View>

				<View style={styles.loginInputContainer}>
					<FormInput
						placeholder="이메일을 입력하세요."
						onFocus = {() => this.refs['scroll'].scrollTo({y: 120})}
						onChangeText={(email) => this.setState({email})}
					/>
					<FormInput
						placeholder="패스워드를 입력하세요."
						secureTextEntry={true}
						onFocus = {() => this.refs['scroll'].scrollTo({y: 130})}
						onChangeText={(password) => this.setState({password})}
					/>
				</View>

				<View style={styles.userBtnContainer}>
					<Button
						btnText="회원가입"
						customStyle={styles.userBtn}
						onPress={() => this.navigation.navigate('JoinMember')}></Button>
					<Button
						btnText="누굴까 로그인"
						customStyle={styles.loginBtn}
						onPress={this.login}></Button>
				</View>

				<Text
					style={styles.findInformation}
					onPress={() => this.navigation.navigate('FindInfo', { navigation: this.navigation })}>아이디/비밀번호 찾기</Text>

				</KeyboardAvoidingView>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	loginContainer: {
		backgroundColor: 'white',
		flex: 1
	},

	loginInputContainer: {
		marginTop: 15,
	},

	friendLoginInputContainer: {
		marginTop: 15,
	},

	labelStyle: {
		color: Theme.defaultPrimaryColor,
		fontSize: Theme.fontMedium,
	},

	findInformation: {
		marginTop: 8,

		fontWeight: 'bold',
		textAlign: 'center',
	},

	userBtnContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	flex: {
		flexDirection: 'row',
		alignItems: 'center',

		marginTop: 20,
	},
	checkbox: {
		padding: 0, // checkbox container 안에 있는 checkbox의 padding 제거
		marginLeft: 25,
		backgroundColor: 'white', // checkbox container 색을 앱의 background와 일치시키기.
	},

	checkboxText: {
		fontSize: Theme.fontMediumSmall
	},

	userBtn: {
		width: 140,
		backgroundColor: Theme.textPrimaryColor,
		marginTop: 8,
	},

	loginBtn: {
		width: 140,
		backgroundColor: Theme.textPrimaryColor,
		marginTop: 8,
	},

	inviteeLogin: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 8,
	},

	border: {
		marginRight: 20,
		marginLeft: 20,
		borderWidth: 1,
		borderColor: Theme.dividerColor,
	},

	noticeContainer: {
		padding: 10,
		marginTop: 10,
		marginRight: 20,
		marginLeft: 20,

		borderWidth: 1,
		borderColor: Theme.defaultBackgroundColor,
	},

	notice: {
		fontSize: Theme.fontMedium,
		lineHeight: 22,
		textAlign: 'center',
		color: Theme.secondaryTextColor,
	},

	noticeHeader: {
		fontSize: Theme.fontMedium,
		lineHeight: 22,
		textAlign: 'center',
		fontWeight: 'bold',
		color: Theme.textPrimaryColor,
	},
})
