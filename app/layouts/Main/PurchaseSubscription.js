import React, { Component } from 'react'
import { StyleSheet, Text, ScrollView, View, ListView, TouchableHighlight } from 'react-native'

import 'intl'
import 'intl/locale-data/jsonp/en'

import InAppBilling from 'react-native-billing'
import { Grid, Row, Col } from 'react-native-elements'
import { Icon, List } from 'react-native-elements'

import Theme from './../../config/styles'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import Payment from './../../utils/Payment'

export default class purchaseSubscription extends Component {
	constructor(props) {
		super(props)

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			products: ds.cloneWithRows(
				[
					{ productId: 'stest_30', name: '1개월 권(30일)', price: 9000, tips: 0, position: 1 },
					{ productId: 'stest_60', name: '2개월 권(60일)', price: 18000, tips: 2000, position: 2 },
					{ productId: 'stest_90', name: '3개월 권(90일)', price: 27000, tips: 5000, position: 3 },
					{ productId: 'stest_180', name: '6개월 권(180일)', price: 54000, tips: 15000, position: 4 },
					// { productId: 'subscription_30', name: '1개월 권(30일)', price: 9000, tips: 0, position: 1 },
					// { productId: 'subscription_60', name: '2개월 권(60일)', price: 18000, tips: 2000, position: 2 },
					// { productId: 'subscription_90', name: '3개월 권(90일)', price: 27000, tips: 5000, position: 3 },
					// { productId: 'subscription_180', name: '6개월 권(180일)', price: 54000, tips: 15000, position: 4 },
				]
			),
		}
		this.navigation = this.props.navigation

		this.renderItem = this.renderItem.bind(this)
		this.onPressItem = this.onPressItem.bind(this)
	}

	renderItem() {
		return (item) => {
			return (
				<TouchableHighlight onPress={this.onPressItem(item.productId)}>
					<View>
						<Grid containerStyle={(item.position % 2 == 0) ? styles.itemContainer : styles.itemContainer2}>
								<Col>
									<Icon
										size={10}
									  name='checkbox-blank-circle-outline'
									  type='material-community'
									  color={Theme.primaryTextColor}
									/>
								</Col>
								<Col><Text style={[styles.text, styles.textBold]}>{item.name}</Text></Col>
								<Col><Text style={[styles.text, styles.textBold]}>{new Intl.NumberFormat("en-US").format(item.price)} 원</Text></Col>
								<Col><Text style={[styles.text, styles.textAccent]}>{new Intl.NumberFormat("en-US").format(item.price - item.tips)} 원</Text></Col>
						</Grid>
					</View>
				</TouchableHighlight>
			)
		}
	}

	onPressItem(productId) {
		return () => Payment.purchaseSubscription(productId, this.navigation)
	}

	render() {
		console.log('in render')
		return (
			<ScrollView style={styles.storeContainer}>
				<View style={styles.noticeContainer}>
					<Text style={styles.notice}>
					* 보유우표가 있는 상태에서 무제한 이용권을 구매했을 경우에는{'\n'}
					이용 기간 동안 우표가 소진되지 않습니다{'\n'}
					* 무제한 이용권은 구매 후에는 환불이 불가능하며, 우표는 구매 후에{'\n'}
					1매도 사용하지 않고 그대로 남아 있는 경우에만 환불이 가능합니다{'\n'}
					* 결제 시에는 10%의 부가가치세(VAT)가 추가됩니다
					</Text>
				</View>

				<ListView
					dataSource={this.state.products}
					renderRow={this.renderItem()}
					renderHeader={() => <Header />}
				/>
			</ScrollView>
		)
	}
}

const Header = (props) => (
	<Row containerStyle={styles.itemContainer}>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>-</Text></Col>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>이용권 종류</Text></Col>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>정상가</Text></Col>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>할인가</Text></Col>
	</Row>
)

const styles = StyleSheet.create({
	header: {
		height: 20
	},

	storeContainer: {
		padding: 15,
		flex: 1,
		backgroundColor: 'white'
	},

	noticeContainer: {
		backgroundColor: Theme.defaultBackgroundColor,
		padding: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: Theme.defaultBackgroundColor,
	},

	notice: {
		fontSize: Theme.fontSmall,
		lineHeight: 22,
		color: Theme.primaryTextColor,
	},

	itemContainer: {
		backgroundColor: Theme.defaultBackgroundColor,
		height: 44,
		marginBottom: 1,
		alignItems: 'center',
	},

	itemContainer2: {
		backgroundColor: Theme.defaultBackgroundColor2,
		height: 44,
		marginBottom: 1,
		alignItems: 'center',
	},

	headerContainer: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
	},

	text: {
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		fontSize: Theme.fontMediumSmall
	},

	textBold: {
		fontWeight: 'bold',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		fontSize: Theme.fontMediumSmall
	},

	textBold: {
		fontWeight: 'bold'
	},

	textAccent: {
		color: Theme.defaultPrimaryColor
	},

})
