import _ from 'lodash'

import { reaction, observable, action } from 'mobx'
import autobind from 'autobind-decorator'

import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

import HttpRequestFactory from './../base/HttpRequestFactory'
import firebase from './../base/Firebase'


const messageSkeleton = {
	topic: '', createdAt: '', updatedAt: '', inviteeId: -1, userId: -1,
	chatUserName: '', phone: '',
	messages: {
		'id': -1,
		'text': '',
		'isRead': false,
		'createdAt': null,
		'updatedAt': null,
		'chatId': -1,
		'inviteeId': -1,
		'userId': null,
		'fileId': null
	},
	time: '',
	chatOn: false,
}

@autobind
class ChatListStore {
  @observable chatList = []
	@observable loggedInfo = {}
	@observable stampCount = 0
  @observable rerender = false

  compositSubscription = []

  constructor() {
    reaction(() => this.rerender, () => {
      if(this.rerender) {
        this.rerender = false
        this._fetch()
      }
    })
  }

	updateStampCount = (stampCount) => {
		this.stampCount = stampCount
	}

	_fetch = async () => {
		try {
			const friends = await this._fetchFriendsFromAsyncStorage()

			const value = await AsyncStorage.getItem('loginInfo')
			this.loggedInfo = JSON.parse(value)

			const fetchData = await HttpRequestFactory.createRestClient('/me', HttpRequestFactory.GET)
			this.stampCount = fetchData.data.item ? fetchData.data.item.stamp : 0
			console.log('fetchData', fetchData)
			console.log(this.stampCount)

			this.type = this.loggedInfo.type // email or invitee
			const url = this.type === 'email' ? 'user/chats' : 'invitee/chats'
			let subscription = HttpRequestFactory.createRxRestClient(url, HttpRequestFactory.GET)
				.subscribe(this._fetchChatList(friends), this._fetchChatListOnError(), this._fetchChatListOnCompleted())
			this.compositSubscription.push(subscription)
		} catch (err) {
      console.log('in fetch error')
			console.log(err)
		}
	}

	_fetchChatList = (friends) => {

    console.log('in fetchChatList')
		return (res) => {
			const list = res.data.map(chat => {
				chat.chatOn = true

				firebase.messaging().subscribeToTopic(chat.topic)
		        if(chat.messages) {
		          chat.messages.text = chat.messages.text ? chat.messages.text : '사진'
		        } else {
		          chat.messages = { text: '첫 메시지를 입력해 주세요~' }
		        }
        		chat.phone = chat.inviteePhone
        		chat.name = chat.chatUserName
				return _.defaults(chat, _.cloneDeep(messageSkeleton))
			})

			this.assignItems(friends ? [...list, ...friends] : [...list])
			
			AsyncStorage.setItem('myFriends', JSON.stringify(list))
			this.store._fetch()
		}
	}

	_fetchChatListOnError = () => {
		return (err) => {
      console.log('onError fetchChatListOnError')
			console.log('_fetchChatListOnError', err)
		}
	}

	_fetchChatListOnCompleted = () => {
		return () => {
			console.log('fetchChatList completed')
		}
	}

	_fetchFriendsFromAsyncStorage = async () => {
		const rawFriends = await AsyncStorage.getItem('friends')
		if (rawFriends === null) {
			return
		}

		const parsedFriends = JSON.parse(rawFriends)
		return parsedFriends.map(friend => {
			friend.chatUserName = friend.name
			return _.defaults(friend, _.cloneDeep(messageSkeleton))
		})
	}

  pushChatItem = (item) => {
    this.chatList.push(item)
  }

  assignItems = (items) => {
    this.chatList = [...items]
  }

  refresh() {
    this.rerender = true
  }


}

// @see https://mobx.js.org/best/store.html
singletonStore = new ChatListStore();
export default singletonStore;
