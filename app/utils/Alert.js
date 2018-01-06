import React, { Component } from 'react'
import { Alert } from 'react-native'

import { Observable } from 'rx'

export default (title, body, positive = 'OK', hot = true, availableCancel = false, negative = 'cancel') => {

	const observable = Observable.create((observer) => {

		const options = [
			{
				text: positive,
				onPress: () => {
					observer.onNext('success')
					observer.onCompleted()
				},
			},
		]

		if (availableCancel) {
			options.push({
				text: negative,
				onPress: () => observer.onError('cancel'),
				style: 'cancel'
			})
		}
		Alert.alert(title, body, options)
	})

	if(!hot) {
		return observable
	}

	const hotObservable = observable.publish()
	hotObservable.connect()
	return hotObservable
}

/*
	Example

	render( ....
		<Text onPress={() => this.showAlert()}>aa</Text>
	)

	showAlert() {
		alert('test', 'test')
		// subscribe(next, err, complete)
	}
*/
