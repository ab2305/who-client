
import {
	AppRegistry,
	AppState,
	Platform
} from 'react-native'

import { sendbird } from './../config/config-dev'

import SendBird from 'sendbird'
import { Observable } from 'rx'

let sb = null

export default {
	init() {
		sb = new SendBird({
			appId: sendbird.KEY
		})
		AppState.addEventListener('change', this._handleAppStateChange)
	},

	connect(loginRes) {
		return Observable.just({ loginRes })
		// return Observable.create((observer) => {
		// 	sb.connect(loginRes.data.id, (user, error) => {
		// 		if (error) {
		// 			observer.onError(error)
		// 			observer.onCompleted()
		// 		} else {
		// 			observer.onNext({ loginRes, user })
		// 			observer.onCompleted()
		// 		}
		// 	})
		// })
	},

	disconnect() {
		sb.disconnect(() => {
			console.log('disconnect')
		})
	},

	createDirectChannel(target) {
		sb.GroupChannel.createChannelWithUserIds([target.id], true, target.id, undefined, {}, undefined, function (createdChannel, error) {
			console.log('create channel')
		})
	},

	_handleAppStateChange: (currentAppState) => {
		if (currentAppState === 'active') {
			if (sb) {
				sb.setForegroundState()
			}
		} else if (currentAppState === 'background') {
			if (sb) {
				sb.setBackgroundState()
			}
		}
	}
}
