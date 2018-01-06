import _ from 'lodash'
import React, { Component } from 'react'
import { AsyncStorage, ScrollView, Switch, Text, TouchableHighlight, View, Platform, StyleSheet } from 'react-native'

import { FormLabel, FormInput } from 'react-native-elements'
import HttpRequestFactory from './../../base/HttpRequestFactory'

import Theme from './../../config/styles'

export default class Settings extends Component {
	constructor(props) {
		super(props)

		this.compositSubscription = []
		this.navigation = this.props.navigation

		this.state = {
			usePush: true,
			useSound: true,
			useVibrate: false,
		}

		this._init()
	}

	_init = async () => {
		const value = await HttpRequestFactory.createRestClient('me/device', HttpRequestFactory.GET)
		if (!value) {
			const defaultSettings = {
				usePush: true,
				useSound: true,
				useVibrate: false,
			}
			this.setState({
				usePush: defaultSettings.usePush,
				useSound: defaultSettings.useSound,
				useVibrate: defaultSettings.useVibrate,
			})
			return
		}

		const settings = value.data
		this.setState({
			usePush: settings.usePush,
			useSound: settings.useSound,
			useVibrate: settings.useVibrate,
		})
	}

	_setSettingsState = async (state) => {
		try{
			this.setState(state)
			await HttpRequestFactory.createRestClient('me/device', HttpRequestFactory.PUT, state)
		} catch(err) {
			console.log(err)
		}
	}

	render() {
		return (
			<View style={styles.settingsContainer}>

				<View style={styles.space} />
				<View style={styles.itemContainer} onPress={this._onNoticePressed} >
					<Text style={styles.text}>메시지 푸시 알림</Text>
					<Switch value={this.state.usePush}
					  thumbTintColor={Theme.darkPrimaryColor}
						onTintColor={Theme.lightPrimaryColor}
						tintColor={Theme.dividerColor}
						onValueChange={(value) =>
							this._setSettingsState({ usePush: value, useSound: false, useVibrate: false })
						} />
				</View>
				<View style={styles.hr} />
				<View style={styles.itemContainer} onPress={this._onNoticePressed} >
					<Text style={[styles.text, styles.subItem]}>소리</Text>
					<Switch value={this.state.useSound}
					  thumbTintColor={Theme.darkPrimaryColor}
						onTintColor={Theme.lightPrimaryColor}
						tintColor={Theme.dividerColor}
						onValueChange={(value) => this._setSettingsState({ usePush: true, useSound: value })
					} />
				</View>
				<View style={styles.hr} />
				<View style={styles.itemContainer} onPress={this._onNoticePressed} >
					<Text style={[styles.text, styles.subItem]}>진동</Text>
					<Switch value={this.state.useVibrate}
					  thumbTintColor={Theme.darkPrimaryColor}
						onTintColor={Theme.lightPrimaryColor}
						tintColor={Theme.dividerColor}
						onValueChange={(value) => this._setSettingsState({ usePush: true, useVibrate: value })
					} />
				</View>
				<View style={styles.hr} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	space: {
		height: 40
	},

	settingsContainer: {
		height: '100%',
		backgroundColor: 'white',
	},

	hr: {
		borderBottomColor: Theme.dividerColor,
		borderBottomWidth: 0.6,
	},

	itemContainer: {
		paddingLeft: 16,
		paddingRight: 16,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 44,
	},

	subItem: {
		paddingLeft: 10
	},

	wrapItem: {
		paddingLeft: 16,
		paddingRight: 16
	},

	text: {
		fontSize: 18,
	},

})
