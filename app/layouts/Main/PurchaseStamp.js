import React, { Component } from 'react'
import { StyleSheet, NativeModules, Text, ScrollView, View, ListView, TouchableHighlight } from 'react-native'
const { InAppUtils } = NativeModules

import 'intl'
import 'intl/locale-data/jsonp/en'

import InAppBilling from 'react-native-billing'
import { Grid, Row, Col } from 'react-native-elements'
import { Icon, List } from 'react-native-elements'

import Theme from './../../config/styles'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import Payment from './../../utils/Payment'

export default class PurchaseStamp extends Component {
	constructor(props) {
		super(props)

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			products: ds.cloneWithRows(
				[
					{ productId: 'stamp_33', stampCount: 33, price: 1000, tips: 0, position: 1 },
					{ productId: 'stamp_100', stampCount: 100, price: 3000, tips: 5, position: 2 },
					{ productId: 'stamp_200', stampCount: 200, price: 6000, tips: 20, position: 3 },
					{ productId: 'stamp_500', stampCount: 500, price: 15000, tips: 100, position: 4 },
					{ productId: 'stamp_1000', stampCount: 1000, price: 30000, tips: 300, position: 5 }]
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
								<Col><Text style={[styles.text, styles.textBold]}>{item.stampCount} 매</Text></Col>
								<Col><Text style={[styles.text, styles.textBold]}>{new Intl.NumberFormat("en-US").format(item.price)} 원</Text></Col>
								<Col><Text style={[styles.text, styles.textAccent]}>{new Intl.NumberFormat("en-US").format(item.tips + item.stampCount)} 매</Text></Col>
						</Grid>
					</View>
				</TouchableHighlight>
			)
		}
	}

	onPressItem(productId) {
		return () => Payment.purchaseStamp(productId, this.navigation)
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
		<Col style={styles.headerContainer}><Text style={styles.textBold}> </Text></Col>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>우표매수</Text></Col>
		<Col style={styles.headerContainer}><Text style={styles.textBold}>구매가격</Text></Col>
		<Col style={styles.headerContainer}>
			<Text style={styles.textBold}>실제지급우표</Text>
		</Col>
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
