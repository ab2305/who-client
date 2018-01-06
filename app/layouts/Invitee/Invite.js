import _ from 'lodash'

import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'

import { FormLabel, FormInput } from 'react-native-elements'

import Alert from './../../utils/Alert'
import Button from './../../components/Button'
import Theme from './../../config/styles'

import HttpRequestFactory from './../../base/HttpRequestFactory'

class Invite extends Component {

	constructor(props) {
		super(props)

		this.state = {
			name: '',
			phone: '',
		}
		this.store = this.props.navigation.state.params.store

		this.friends = []
		this.myFriends = []

		this.invite = this.invite.bind(this)
		this._initFriends = this._initFriends.bind(this)

		this._initFriends()
	}

	async invite() {
		// TODO validation
		const phone = this.state.phone.replace(/ /g, '')
		const name = this.state.name

		const hasUser = _.find(this.friends, { phone }) || _.find(this.myFriends, { phone })

		if(hasUser) {
			Alert('', '이미 누구친으로 등록된 휴대폰 번호입니다. 번호를 다시 확인해 주세요.')
			this.props.navigation.goBack(null)
			return
		}

		this.friends.push({ phone, name })

		try {
			await AsyncStorage.setItem('friends', JSON.stringify(this.friends))
			this.props.navigation.goBack(null)
			this.store.refresh()
		} catch (err) {
			console.log(err)
			Alert('에러가 발생했습니다.', err)
		}
	}

	async _initFriends() {
		const rawFriends = await AsyncStorage.getItem('friends')
		const rawMyFriends = await AsyncStorage.getItem('myFriends')
		
		if (rawFriends === null || rawMyFriends === null) {
			return
		}

		const myRawMyFriends = _.map(JSON.parse(rawMyFriends), function(value) {
			return _.pick(value, ['name', 'phone'])
		});
		
		this.friends = JSON.parse(rawFriends)
		this.myFriends = myRawMyFriends
	}

	render() {
		return (
			<ScrollView style={styles.inviteContainer}>
				<View style={styles.formContainer}>
					<FormLabel labelStyle={styles.labelStyle}>이름</FormLabel>
					<FormInput
						onChangeText={(name) => this.setState({ name })}
						inputStyle={styles.inputContainer}
					/>
					<Text style={styles.hint}>상대방이 채팅에 응하도록 하기 위해서는 상대방의{'\n'}실명을 입력하기를 권해 드립니다.</Text>
				</View>
				<View style={styles.formContainer}>
					<FormLabel labelStyle={styles.labelStyle}>휴대폰번호</FormLabel>
					<FormInput
						onChangeText={(phone) => this.setState({ phone })}
						keyboardType='numeric'
						inputStyle={styles.inputContainer}
					/>
					<Text style={styles.hint}>-없이 숫자만 입력해 주세요.</Text>
				</View>
				<View style={styles.btnContainer}>
					<Button onPress={this.invite} btnText="완료" />
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	inviteContainer: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 30,
		paddingRight: 15,
		paddingBottom: 15,
		paddingLeft: 30,
	},

	inputContainer: {
		width: '90%',
	},

	formContainer: {
		marginTop: 15,
		marginBottom: 15,
	},

	labelStyle: {
		color: Theme.defaultPrimaryColor,
		fontSize: Theme.fontMedium,
	},

	hint: {
		margin: 15,

		color: Theme.defaultPrimaryColor,
	},

	btnContainer: {
		marginTop: 50,
		marginBottom: 50,
	}
})

export default Invite
