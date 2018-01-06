import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, Text, ScrollView, View } from 'react-native'
import InAppBilling from 'react-native-billing'

import Button from './../../components/Button'
import Theme from './../../config/styles'
import Table from './../../components/Table'
import Alert from './../../utils/Alert'

export default class Store extends Component {
	constructor(props) {
		super(props)

		this.state = {}
		this.navigation = this.props.navigation

		this.checkHistory = this.checkHistory.bind(this)
		this.purchase = this.purchase.bind(this)
		this.purchaseSubscription = this.purchaseSubscription.bind(this)
		this._init()
	}

	checkHistory() {
		if(this.type === 'email') {
			this.navigation.navigate('History', { id: this.userId })
			return
		}
		Alert('', '누구친은 스토어 기능을 이용할 수 없습니다.')
	}

	purchase() {
		if(this.type === 'email') {
			this.navigation.navigate('Purchase')
			return
		}
		Alert('', '누구친은 스토어 기능을 이용할 수 없습니다.')
	}

	purchaseSubscription() {
		if(this.type === 'email') {
			this.navigation.navigate('PurchaseSubscription')
			return
		}
		Alert('', '누구친은 스토어 기능을 이용할 수 없습니다.')
	}

	_init = async () => {
		const value = await AsyncStorage.getItem('loginInfo')
		const loggedInfo = JSON.parse(value)
		this.userId = loggedInfo.id
		this.type = loggedInfo.type // email or invitee

		console.log('in init',this.userId)
	}

	render() {
		const stamp = {
			tableHead: ['우표매수', '구매가격', '추가 서비스', '실제지급 우표',],
			tableData: [
				['30매', '900원', '0', '30매'],
				['100매', '3,000원', '5매 (5% 추가)', '105매'],
				['200매', '6,000원', '20매 (10% 추가)', '220매'],
				['500매', '15,000원', '100매 (20% 추가)', '600매'],
				['1000매', '30,000원', '300매 (30% 추가)', '1300매'],
			],
			colHeight: 30,
		}

		const freeStamp = {
			tableHead: ['이용권 종류', '정상가', '할인가',],
			tableData: [
				['1개월 권(30일)', '9,000원', '9,000원'],
				['2개월 권(60일)', '18,000원', '16,000원 (2,000원 할인)'],
				['3개월 권(90일)', '27,000원', '22,000원 (5,000원 할인)'],
				['6개월 권(180일)', '54,000원', '39,000원 (15,000원 할인)'],
			],
			colHeight: 30,
		}

		return (
			<ScrollView style={styles.storeContainer}>
				<Text style={styles.myHistory} onPress={this.checkHistory}>> 나의 내역 보러가기</Text>

				<Text style={styles.textStyle}>우표 구매 또는 무제한 이용권 구매 중 편한 방식을 선택해 주세요</Text>
				<Text style={styles.textStyle}>- <Text style={styles.subTitle}>우표 구매</Text> : 문자발송 1건 당 우표 1매 씩 소진되며, </Text>
				<Text style={styles.textStyle}>- <Text style={styles.subTitle}>무제한 이용권 구매</Text> : 이용기간 동안에는 무제한으로 문자를 발송할 수 있습니다.</Text>

				<View style={styles.buyStamp}>
					<Text style={styles.tableTitle}>우표 구매</Text>
					<Table tableProps={styles.tableProps} bodyText={styles.bodyText} fields={stamp.tableHead} data={stamp.tableData} height={stamp.colHeight} flexArr={[1, 1, 2, 2]}></Table>
					<Button btnText="우표 구매" style={styles.btnStyle} onPress={this.purchase}></Button>
				</View>

				<View style={styles.buyFreeStamp}>
					<Text style={styles.tableTitle}>무제한 이용권 구매</Text>
					<Table tableProps={styles.tableProps} bodyText={styles.bodyText} fields={freeStamp.tableHead} data={freeStamp.tableData} height={freeStamp.colHeight} flexArr={[2, 1, 3]}></Table>
					<Button btnText="무제한 이용권 구매" style={styles.btnStyle} onPress={this.purchaseSubscription}></Button>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	storeContainer: {
		padding: 15,
		backgroundColor: 'white'
	},

	myHistory: {
		marginBottom: 10,

		textAlign: 'right',
		fontWeight: 'bold',
	},

	subTitle: {
		color: 'black',
		fontWeight: 'bold',
	},

	textStyle: {
		lineHeight: Theme.fontMediumSmall * 1.75,
		fontSize: Theme.fontMediumSmall
	},

	tableTitle: {
		color: 'black',
		fontSize: Theme.fontMedium,
		fontWeight: 'bold',
	},

	buyStamp: {
		marginTop: 15,
	},

	buyFreeStamp: {
		marginTop: 30,
		marginBottom: 30,
	},

	tableProps: {
		marginTop: 15,
		marginBottom: 30,
	},

	bodyText: {
		fontSize: 12,
		alignSelf: 'center'
	},
})
