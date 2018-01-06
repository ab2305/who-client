import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Theme from './../../config/styles'

export default class Header extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<View style={styles.headerContainer}>
				<Text style={styles.headerTitle}>{this.props.title}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: Theme.defaultPrimaryColor,
		padding: 15,
	},

	headerTitle: {
		color: Theme.textPrimaryColor
	}
})
