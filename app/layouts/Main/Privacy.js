import _ from 'lodash'
import moment from 'moment'

import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, TouchableHighlight, View, Text } from 'react-native'
import { Icon, List, FormLabel, FormInput } from 'react-native-elements'

import Alert from './../../utils/Alert'
import Button from './../../components/Button'
import Theme from './../../config/styles'
import Input from '../../components/Input'
import { NavigationActions } from 'react-navigation'

import HttpRequestFactory from './../../base/HttpRequestFactory'

export default class Privacy extends Component {
	constructor(props) {
		super(props)

		this.state = {
			password: ''
		}
		this.navigation = this.props.navigation
	}

	onUnregisterPress = () => {

		const secederObservable = HttpRequestFactory.createRxRestClient(
			'seceder', HttpRequestFactory.POST, {}
		)
		const alertObservable = Alert('', '회원 탈퇴 처리되었습니다.', undefined, false)

		Alert('', '정말로 회원탈퇴를 하시겠습니까? ', '확인', false, true, '취소')
			.flatMap(() => secederObservable)
			.flatMap(res => alertObservable)
			.subscribe(
				() => {
					const resetAction = NavigationActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({ routeName: 'Login' })
						]
					})
					this.props.navigation.dispatch(resetAction)
				},
				(err) => console.log(err)
		)
	}

	onChangePasswordPress = async () => {
		console.log('onChangePasswordPress', this.state)

		const value = await AsyncStorage.getItem('loginInfo')
		console.log(value)
		if(value === null) {
			return
		}
		const loggedInfo = JSON.parse(value)

		if(this.state.newPassword === loggedInfo.password
			|| this.state.password !== loggedInfo.password) {
			console.log('equals password or current password not matches')
			return
		}

		const passwordObservable = HttpRequestFactory.createRxRestClient(
			'me/password', HttpRequestFactory.PUT, { password: this.state.password }
		)
		const alertObservable = Alert('회원 수정', '비밀번호가 변경되었습니다.', undefined, false)

		passwordObservable.flatMap(res => alertObservable)
			.subscribe(
				() => {
					loggedInfo.password = this.state.newPassword
					AsyncStorage.setItem('loginInfo', JSON.stringify(loggedInfo), (err) => {
						console.log(err)
					})
				},
				(err) => console.log(err)
			)
	}

	render() {
		return (
			<View style={styles.privacyContainer}>
				<View style={styles.changePasswordContainer} >
					<FormLabel labelStyle={styles.labelStyle}>현재 비밀번호 입력</FormLabel>
					<FormInput
						secureTextEntry={true}
						onChangeText={(password) => this.setState({ password })}
					/>
					<FormLabel labelStyle={styles.labelStyle}>변경할 비밀번호</FormLabel>
					<FormInput
						secureTextEntry={true}
						onChangeText={(newPassword) => this.setState({ newPassword })}
					/>
					<View />

					<View style={styles.passwordChangeContainer}>
						<Button
							btnText="비밀번호 변경"
							customStyle={styles.passwordChangeBtn}
							onPress={this.onChangePasswordPress}></Button>
					</View>
				</View>

				<TouchableHighlight underlayColor={Theme.defaultBackgroundColor} style={styles.itemContainer} onPress={this._onNoticePressed} >
					<Text style={[styles.text, styles.secret]} onPress={this.onUnregisterPress}>회원 탈퇴</Text>
				</TouchableHighlight>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	privacyContainer: {
		flex: 1,
		backgroundColor: 'white'
	},

	hr: {
		borderBottomColor: 'black',
		borderBottomWidth: 1,
	},

	itemContainer: {
		width: '100%',
		height: 40,
		paddingLeft: 16,
		justifyContent: 'center'
	},

	text: {
		fontSize: 16,
	},

	secret: {
		color: Theme.dividerColor
	},

	// 스크롤에 flex:1 을 주면, 영역이 고정되어서 스크롤이 먹히지 않는다.
	scrollStyle: {
		backgroundColor: Theme.talkBackgroundColor,
	},

	passwordChangeContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},

	passwordChangeBtn: {
		width: 140,
		marginBottom: 20
	},

})
