import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Button from './../../components/Button'
import Input from './../../components/Input'
import Theme from './../../config/styles'

import HttpRequestFactory from './../../base/HttpRequestFactory'

export default class FindInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			phone: '',
		}
		this.compositSubscription = []

		this.findPassword = this.findPassword.bind(this)
		this.findId = this.findId.bind(this)
	}

	findId() {
		const phone = this.state.phone
		console.log({ phone })
		HttpRequestFactory.createRxRestClient(
			'/user/emailfinding', HttpRequestFactory.POST, { phone }
		).subscribe(
			(res) => {
				console.log('insuccess', res)
				// this.refs.toast.show('이메일 주소가 sms로 전송되었습니다')
			},
			(err) => {
				console.log('onError', err)
				// this.refs.toast.show('이메일 주소를 찾는 중 에러가 발생했습니다.')
			},
			() => {
				this.props.navigation.goBack(null)
			}
		)
	}

	findPassword() {
		const email = this.state.email
		console.log({ email })
		HttpRequestFactory.createRxRestClient(
			'/user/tpassword', HttpRequestFactory.POST, { email }
		).subscribe(
			(res) => {
				console.log('insuccess', res)
				// this.refs.toast.show('임시 비밀번호가 이메일로 전송되었습니다')
			},
			(err) => {
				console.log('onError', err)
				// this.refs.toast.show('임시 비밀번호 발급 처리 중 에러가 발생했습니다.')
			},
			() => {
				this.props.navigation.goBack(null)
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.subTitle}>* 아이디 찾기</Text>
				<Input label="휴대폰번호" fontSize={Theme.fontMediumSmall} type="number" placeholder="'-' 없이 번호만 입력하세요." onChangeText={(phone) => this.setState({ phone })}></Input>

				<View style={styles.btnContainer}>
					<Button btnText="확인" style={styles.btn} onPress={this.findId}></Button>
				</View>

				<Text style={styles.notice}>
					화원가입시 등록했던 휴대폰번호를 입력한 후{'\n'}
					'확인'을 누르시면 SMS로 아이디(이메일)을 보내드립니다.
				</Text>

				<View style={styles.border}></View>

				<Text style={styles.subTitle}>* 비밀번호 찾기</Text>
				<Input label="아이디" fontSize={Theme.fontMediumSmall} type="" placeholder="이메일을 입력하세요." onChangeText={(email) => this.setState({ email })}></Input>

				<View style={styles.btnContainer}>
					<Button btnText="확인" style={styles.btn} onPress={this.findPassword}></Button>
				</View>

				<Text style={styles.notice}>
					화원가입시 등록했던 휴대폰번호를 입력한 후{'\n'}
					'확인'을 누르시면 SMS로 아이디(이메일)을 보내드립니다.
				</Text>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
		paddingBottom: 20
	},

	subTitle: {
		margin: 20,

		fontSize: Theme.fontMedium,
		fontWeight: 'bold',
	},

	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'center',

		marginTop: 20,
	},

	btn: {
		width: '25%',
	},

	notice: {
		marginTop: 30,

		fontSize: Theme.fontMediumSmall,
		textAlign: 'center',
	},

	border: {
		marginTop: 20,
		borderBottomColor: Theme.dividerColor,
    borderBottomWidth: 1,
	},
})
