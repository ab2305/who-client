import _ from 'lodash'
import moment from 'moment'

import React, { Component } from 'react'
import { AsyncStorage, StyleSheet, ScrollView, View, Text } from 'react-native'

import { graphql, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

import Table from './../../components/Table'
import Theme from './../../config/styles'

import HttpRequestFactory from './../../base/HttpRequestFactory'
import Queries from './../../base/Queries'

export default class HistoryOfPurchase extends Component {
	constructor(props) {
		super(props)

		this.state = {
			histories: []
		}
		this.userId = this.props.navigation.state.params.id
		console.log(this.userId)
		this.graphClient = HttpRequestFactory.createGraphClient()
		this._init()
	}

	_init = async () => {
		// /user/usinghistories?limit=<limit>&page=<page>
		// 		 "id": 7,
    //     "usedStamp": 4,
    //     "createdAt": "2017-08-17T02:55:54.332Z",
    //     "invitee": "경만"
		const res = await HttpRequestFactory.createRestClient('user/usinghistories?limit=1000&page=1&top=true', HttpRequestFactory.GET)
    const histories = res.data
		const mappedData = _.map(histories, (item) => {
			return [
				moment(item.createdAt).format('L'), item.invitee, item.usedStamp
			]
		})

    console.log('histories = ', mappedData)
    this.setState({ histories: mappedData })
	}

	render() {
		const historyOfStamp = {
			tableHead: ['날짜', '누구친', '사용매수'],
			colHeight: 30,
		}

		const QueryHistoryOfPurchaseWithData = graphql(Queries.billingHistoryQuery, {
			options: {
				variables: { userId: this.userId },
				notifyOnNetworkStatusChange: true,
			}
		})(HistoryOfPurchaseComponent)

		return (
			<ApolloProvider client={this.graphClient}>
				<ScrollView style={styles.historyContainer}>
					<View style={styles.historyOfPurchase}>
						<Text style={styles.tableTitle}>구매 내역</Text>
						<QueryHistoryOfPurchaseWithData />
					</View>

					<View style={styles.historyOfPurchase}>
						<Text style={styles.tableTitle}>우표사용내역</Text>
						<Table borderStyle={{borderWidth: 0.5, borderColor: 'white'}} tableProps={styles.tableProps} fields={historyOfStamp.tableHead} data={this.state.histories} height={historyOfStamp.colHeight} flexArr={[2, 1, 1, 1]}></Table>
					</View>
				</ScrollView>
			</ApolloProvider>
		)
	}
}

const HistoryOfPurchaseComponent = ({ data }) => {
	const height = 30
	const head = ['구매 아이템', '결제금액', '결제일']

	const array = data.billingHistories ? data.billingHistories.map(
		(item) => _.toArray(_.pick(item, ['productName', 'price', 'createdAt']))
	) : undefined

	if(array) {
		array.forEach(item => item[2] = moment(item[2]).format('YYYY-MM-DD'))
	}
	return (
		<Table bodyText={styles.bodyText} tableProps={styles.tableProps} borderStyle={{borderWidth: 0.5, borderColor: 'white'}} fields={head} data={array} height={height} flexArr={[2, 1, 1]}></Table>
	)
}

const styles = StyleSheet.create({
	historyContainer: {
		padding: 15,
		backgroundColor: 'white',
	},

	historyOfPurchase: {
		marginBottom: 20,
	},

	tableTitle: {
		fontSize: Theme.fontMedium,
		fontWeight: 'bold',
	},

	tableProps: {
		marginTop: 15,
	},

	bodyText: {
		textAlign: 'center'
	}
})
