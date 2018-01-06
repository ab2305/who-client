import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'

export default class WhoDatePicker extends Component {
	constructor(props) {
		super(props)

		this.state = {date: ''}
	}

	render() {
		const minDate = this.props.minDate ? this.props.minDate : '1900-01-01'
		const maxDate = this.props.maxDate ? this.props.maxDate : moment().format('YYYY-MM-DD')

		return (
			<DatePicker
				style={{width: 200}}
				date={this.state.date}
				mode="date"
				placeholder="날짜 선택"
				format="YYYY-MM-DD"
				minDate={minDate}
				maxDate={maxDate}
				confirmBtnText="Confirm"
				cancelBtnText="Cancel"
				onDateChange={(date) => {this.setState({date: date})}}
			/>
		)
	}
}
