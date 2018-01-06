import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { InputItem } from 'antd-mobile'

import Theme from './../config/styles'

export default class Input extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const {style, inputStyle, fontSize, type, label, placeholder, onChangeText} = this.props
		console.log(inputStyle)
		return (
			<View style={styles.inputContainer}>
				<Text style={[styles.label, style]}>{label}</Text>

				<InputItem
					style={[styles.input]}
					fontSize={fontSize}
					type={type}
					placeholder={placeholder}
					onChange={onChangeText}
				>
				</InputItem>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',

		marginTop: 10,
		marginLeft: 15,
		marginRight: 15,
	},

	label: {
		width: '22%',
		height: 30,

		padding: 5,

		fontSize: Theme.fontMedium,
		color: '#000000',
	},

	input: {
		flex: 1,

		borderBottomWidth: 1,
	},
})
