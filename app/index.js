
// app/index.js
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Text, View, Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { observer } from 'mobx-react/native'

import Login from './layouts/Login/Login'
import Theme from './config/styles'

import HttpRequestFactory from './base/HttpRequestFactory'

// 성능에 문제가 없을지 고민해보아야할듯.
@observer
export default class App extends Component {
	render() {
		const navigation = this.props.navigation
		const graphClient = HttpRequestFactory.createGraphClient()

		// TODO network status check
		const ping = HttpRequestFactory.createRestClient('/ping', 'get', [])
		ping.then(data => {})

		// let tabBarPosition

		// if (Platform.OS === 'android') {
		// 	this.tabBarPosition = 'top'
		// }

		return (
			<ApolloProvider client={graphClient}>
				<Login navigation={navigation}></Login>
			</ApolloProvider>
		)
	}

	componentDidMount() {
		SplashScreen.hide()
	}
}
