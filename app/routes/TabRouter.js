import { TabNavigator } from 'react-navigation'

import Chat from './../layouts/Main/Chat'
import Store from './../layouts/Main/Store'
import MoreInfo from './../layouts/Main/MoreInfo'

import Theme from './../config/styles'

const Router = TabNavigator(
	{
		Chat: {
			screen: Chat,
			path: '/',
			navigationOptions: {
				title: '누굴까',
				headerStyle: {
					backgroundColor: Theme.defaultPrimaryColor,
				},
				headerTintColor: '#ffffff',
			}

		},
		Store: {
			path: '/store',
			screen: Store,
		},
		MoreInfo: {
			path: '/more',
			screen: MoreInfo,
		},
	},
	{
		tabBarOptions: {
			activeTintColor: Theme.defaultPrimaryColor,
			inactiveTintColor: 'gray',
			style: {
				backgroundColor: Theme.lightPrimaryColor,
			},
		},
	}
)

export default Router
