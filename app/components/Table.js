import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Table, Row, Cols } from 'react-native-table-component'

import Theme from './../config/styles'

export default class WhoTable extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { fields, data, height, tableProps, flexArr, borderStyle, bodyText } = this.props
		console.log(borderStyle)
		const items = data
		const transposedData = items && items.length > 0 ? transpose(data) : []

		let heightArr = 0
		if (transposedData.length > 0) {
			heightArr = Array.apply(null, Array(items.length + 1)).map(() => height)
		}

		return (
			<View>
				<Table style={[styles.table, tableProps]} borderStyle={borderStyle ? borderStyle : styles.borderStyle}>
					<Row data={fields} style={styles.head} textStyle={styles.headText} flexArr={flexArr} />
					<Cols data={transposedData} textStyle={bodyText ? bodyText : styles.bodyText} heightArr={heightArr} flexArr={flexArr} />
				</Table>
			</View>
		)
	}
}

const transpose = function (matrix) {
	return Object.keys(matrix[0])
		.map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]))
}

const styles = StyleSheet.create({
	table: {
		width: '100%',
	},
	borderStyle: {
		borderWidth: 0.5,
		borderColor: 'gray',
	},

	head: { height: 40, backgroundColor: Theme.defaultBackgroundColor },
	headText: { textAlign: 'center', fontWeight: 'bold' },
	bodyText: { textAlign: 'center' },
})

// RN 전체적으로 테이블 관련 라이브러리가 평신인듯 ..
/* Example
		import Table from '../../components/Table'

		const testFields = ['우표매수', '구매가격', '추가 서비스', '실제 지급 우표']
		const testData = [
			['30매', '900원', '0', '30매'],
			['100매', '1900원', '0', '30매'],
		]

		const testHeight = 20

		render(
			....
				<Table fields={testFields} data={testData} height={testHeight}></Table>
		)
*/
