import React, { Component } from 'react'
import { AsyncStorage, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'

import Login from './Login/Login'
import Guide from './Main/Guide'

class App extends Component {

	constructor(props) {
		super(props)
	}

  _launch = async () => {
    try {
      console.log('in launch')
    	const value = await AsyncStorage.getItem('loginInfo')
      const routeName = value ? 'Login' : 'Guide'
      console.log('value', value)
      const resetAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: routeName })
				]
			})
			this.props.navigation.dispatch(resetAction)
      console.log('dispatch..')
  		SplashScreen.hide();
    } catch (err) {
    	console.log(err)
    	return Guide
    }
  }

	render() {
		return (
			<View />
		)
	}

  componentDidMount() {
		this._launch()
  }
}

export default App
