import _ from 'lodash'
import { StackNavigator } from 'react-navigation'

import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import App from './../layouts/App'
import Login from './../layouts/Login/Login'
import FindInfo from './../layouts/Login/FindInfo'
import JoinMember from './../layouts/Login/JoinMember'
import Invite from './../layouts/Invitee/Invite'

import { TabNavigator } from 'react-navigation'

import ChatList from './../layouts/Main/ChatList'
import Store from './../layouts/Main/Store'
import MoreInfo from './../layouts/Main/MoreInfo'

import Chat from './../layouts/Main/Chat'
import History from './../layouts/Main/HistoryOfPurchase'
import Purchase from './../layouts/Main/PurchaseStamp'
import PurchaseSubscription from './../layouts/Main/PurchaseSubscription'
import Settings from './../layouts/Main/Settings'
import Privacy from './../layouts/Main/Privacy'
import Notice from './../layouts/Main/Notice'
import DirectMessage from './../layouts/Main/DirectMessage'
import Guide from './../layouts/Main/Guide'
import Faq from './../layouts/Main/Faq'
import Question from './../layouts/Main/Question'
import QuestionRequest from './../layouts/Main/QuestionRequest'
import Terms from './../layouts/Main/Terms'

import { Icon, List } from 'react-native-elements'

import Theme from './../config/styles'

const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: Theme.defaultPrimaryColor,
	},
	headerTintColor: 'white',
}

const customNavigationOption = (obj) => {
	return _.defaults(_.cloneDeep(defaultNavigationOptions), obj)
}

const tabRouters = {
	ChatList: {
		path: '/',
		screen: ChatList,
		navigationOptions: customNavigationOption({
			tabBarLabel: '채팅',
			tabBarIcon: ({ tintColor }) =>
				<Icon
					name='ios-chatbubbles'
					color={ Theme.lightPrimaryColor }
					type='ionicon'
					size={25} />
			}),
	},
	/*Store: {
		path: '/store',
		screen: Store,
		navigationOptions: customNavigationOption({
			tabBarLabel: '스토어',
			tabBarIcon: ({ tintColor }) =>
				<Icon
					name='credit-card'
					color={ Theme.lightPrimaryColor }
					type='octicon'
					size={25} />
			}),
	},*/
	MoreInfo: {
		path: '/more',
		screen: MoreInfo,
		navigationOptions: customNavigationOption({
			tabBarLabel: '더보기',
			tabBarIcon: ({ tintColor }) =>
				<Icon
					name='dots-three-horizontal'
					color={ Theme.lightPrimaryColor }
					type='entypo'
					size={24} />
			}),
	},
}

const TabRouter = TabNavigator(
	tabRouters,
	{
		tabBarOptions: {
			activeTintColor: Theme.defaultPrimaryColor,
			inactiveTintColor: 'gray',
			indicatorStyle: {
				backgroundColor: Theme.defaultPrimaryColor
			},
			style: {
				backgroundColor: Theme.defaultBackgroundColor,
			},
			showIcon: true,
			showLabel: true,
			labelStyle: {
				fontSize: 10,
				padding: 0,
				margin: 0
			}
		},
	}
)

const Router = StackNavigator(
	{
		App: {
			screen: App,
			navigationOptions: customNavigationOption({ title: '누굴까' })
		},

		Login: {
			screen: Login,
			navigationOptions: customNavigationOption({ title: '로그인' })
		},

		FindInfo: {
			screen: FindInfo,
			navigationOptions: customNavigationOption({ title: '아이디/비밀번호 찾기' }),
		},

		JoinMember: {
			screen: JoinMember,
			navigationOptions: customNavigationOption({ title: '회원가입' }),
		},

		Main: {
			screen: TabRouter,
			navigationOptions: customNavigationOption({ title: '누굴까' })
		},

		History: {
			screen: History,
			navigationOptions: customNavigationOption({ title: '서비스 이용내역' })
		},

		Invite: {
			screen: Invite,
			navigationOptions: customNavigationOption({ title: '누구친 등록하기' })
		},

		Chat: {
			screen: Chat,
		},

		Purchase: {
			screen: Purchase,
			navigationOptions: customNavigationOption({ title: '우표 구매하기' })
		},

		PurchaseSubscription: {
			screen: PurchaseSubscription,
			navigationOptions: customNavigationOption({ title: '무제한 이용권 구매하기' })
		},

		Settings: {
			screen: Settings,
			navigationOptions: customNavigationOption({ title: '설정' })
		},

		Privacy: {
			screen: Privacy,
			navigationOptions: customNavigationOption({ title: '회원 정보 관리' })
		},

		Notice: {
			screen: Notice,
			navigationOptions: customNavigationOption({ title: '공지사항' })
		},

		DirectMessage: {
			screen: DirectMessage,
			navigationOptions: customNavigationOption({ title: '누굴까 메시지' })
		},

		Faq: {
			screen: Faq,
			navigationOptions: customNavigationOption({ title: '자주 묻는 질문' })
		},

		Guide: {
			screen: Guide,
			navigationOptions: customNavigationOption({ title: '누굴까 소개' })
		},

		Question: {
			screen: Question,
			navigationOptions: customNavigationOption({ title: '1:1 문의하기' })
		},

		QuestionRequest: {
			screen: QuestionRequest,
			navigationOptions: customNavigationOption({ title: '1:1 문의하기' })
		},

		Terms: {
			screen: Terms,
			navigationOptions: customNavigationOption({ title: '이용 약관' })
		},
	}
)

export default Router
