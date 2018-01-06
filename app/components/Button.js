import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

import Theme from './../config/styles'

export default class WhoButton extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		// style은 버튼의 크기를 정의한 스타일을 받는다. (대체로 %로 받고 있음.)
		const {btnText, customStyle} = this.props
		const onPressCallback = this.props.onPress

		return (
			<View>
				<Button
					title={btnText}
					buttonStyle={[styles.buttonStyle, customStyle]}
					borderRadius={5}
					containerViewStyle={1}
					onPress={onPressCallback}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	buttonStyle: {
		backgroundColor: Theme.defaultPrimaryColor,
		minWidth: 100,
	},

	textStyle: {
		color: '#ffffff',
	}
})
