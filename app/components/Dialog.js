import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Modal } from 'antd-mobile'

// import Theme from './../../config/styles'

export default class Dialog extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const store = this.props.store

		return (
			<View>
				<Modal
					visible={store.dialogVisible}
					onClose={store.onDialogClose}
					title={this.props.title} transparent
					maskClosable={false}
					footer={
						[{
							text: this.props.title, onPress: () => {
								store.onDialogPress()
								store.onDialogClose()
							}
						}]
					}>
					<Text>{this.props.body}</Text>
				</Modal>
			</View>
		)
	}
}

// example

/*

import Dialog from './components/Dialog'

import uiStateStore from './stores/UiStateStore'
const DialogObserver = observer(Dialog);

import { Button } from 'antd-mobile';

render (
	....
	<Button onClick={this.showModal()}>showModal</Button>
	<DialogObserver store={uiStateStore} title='Title' body='body' />
)

showModal = () => (e) => {
	e.preventDefault()
	uiStateStore.onDialogOpen()
}
*/
