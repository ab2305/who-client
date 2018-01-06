import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { CheckBox } from 'react-native-elements'
import moment from 'moment'
import { NavigationActions } from 'react-navigation';

import { graphql, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag'

import Button from './../../components/Button'
import DatePicker from './../../components/DatePicker'
import Input from './../../components/Input'
import Theme from './../../config/styles'
import alert from './../../utils/Alert'

import HttpRequestFactory from './../../base/HttpRequestFactory'
import Queries from './../../base/Queries'

const radio_props = [
	{ label: '남자', value: 'male', },
	{ label: '여자', value: 'female', },
]

export default class JoinMember extends Component {
	constructor(props) {
		super(props)

		// birthYear 의 경우 다른 브랜치에서 작업되었으므로, 일단 반영
		this.state = {
			checked: false,
			email: '',
			password: '',
			passwordConfirm: '',
			name: '',
			nickname: '',
			gender: 'male',
			birthYear: '2017',
			phone: '',
		}

		this.CreateAccount = this.CreateAccount.bind(this)
	}

	render() {
		const graphClient = HttpRequestFactory.createGraphClient()
		const CreateAccountWithData = graphql(Queries.createAccountMutation)(this.CreateAccount);

		return (
			<ApolloProvider client={graphClient}>
				<ScrollView style={styles.joinMemberContainer}>
					<View>
						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="" label="아이디(*)" placeholder="이메일을 입력하세요" onChangeText={(email) => this.setState({ email })}></Input>
						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="password" label="비밀번호(*)" placeholder="8자 이내 숫자,문자,특수문자" onChangeText={(password) => this.setState({ password })}></Input>
						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="password" label="비밀번호 확인(*)" placeholder="위의 비밀번호 다시 입력" onChangeText={(passwordConfirm) => this.setState({ passwordConfirm })}></Input>
					</View>

					<View style={styles.nameInfoContainer}>
						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="" label="이름(*)" placeholder="실명입력" onChangeText={(name) => this.setState({ name })}></Input>

						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="" label="닉네임(*)" placeholder="한글 6자/ 영문 12자 이내" onChangeText={(nickname) => this.setState({ nickname })}></Input>
						<Text style={styles.warningText}>
						대화상대에게는 오직 닉네임만 공개되며{'\n'}
						한 번 설정한 닉네임은 변경할 수 없습니다.
						</Text>

						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="number" label="핸드폰 번호" placeholder="01000000000" onChangeText={(phone) => this.setState({ phone })}></Input>
					</View>

					<View style={styles.flex}>
						<Text style={styles.textLabel}>성별</Text>
						<RadioForm
							radio_props={radio_props}
							initial={0}
							formHorizontal={true}
							labelHorizontal={true}
							animation={true}
							buttonColor={Theme.dividerColor}
							buttonSize={4}
							labelStyle={{ marginRight: 30, fontSize: 13 }}
							onPress={(gender) => this.setState({ gender })}>
						</RadioForm>
					</View>

					<View style={styles.flex}>
						<Input style={styles.label} fontSize={Theme.fontMediumSmall} type="number"               label="태어난 해" placeholder="YYYY" onChangeText={(birthYear) => this.setState({ birthYear })}></Input>
					</View>

					<View style={styles.flex}>
						<CheckBox
							title='이용약관 및 개인정보 취급방침에 동의합니다'
							checked={this.state.checked}
							containerStyle={styles.checkbox}
							textStyle={styles.checkboxText}
							onPress={() => { this.setState({ checked: !this.state.checked }) }}
						/>
						<Text style={{ fontWeight: 'bold', fontSize: Theme.fontMediumSmall }} onPress={this.onTermPressed}>[보기]</Text>
					</View>

					<View style={styles.btnContainer}>
						<CreateAccountWithData />
					</View>
				</ScrollView>
			</ApolloProvider>
		)
	}

	CreateAccount = ({ mutate }) => {
		const handleOnPress = () => {
			if (!this.state.checked) {
				alert('', '이용 약관에 동의해주세요')
				return
			}
			

			mutate({
				variables: {
					email: this.state.email, password: this.state.password, name: this.state.name,
					nickname: this.state.nickname, gender: this.state.gender, birthYear: this.state.birthYear, phone: this.state.phone
				}
			})
				.then((res) => {
					
					const backAction = NavigationActions.back({ key: null })
					this.props.navigation.dispatch(backAction)
				})
				.catch((err) => {
					alert('', '서버 작업 중 에러가 발생했습니다.')
				
					console.log(err)
				})
		}

		return (
			<Button btnText="회원가입" style={styles.btn} onPress={handleOnPress}></Button>
		)
	}

	onTermPressed = () => {
		this.props.navigation.navigate('Terms')
	}
}

const styles = StyleSheet.create({
	joinMemberContainer: {
		flex: 1,
		backgroundColor: 'white',
	},

	label: {
		width: '30%',
	},

	nameInfoContainer: {
		marginTop: 15,
	},

	warningText: {
		marginTop: 10,
		fontSize: 12,

		fontWeight: 'bold',
		color: 'red',
		textAlign: 'center',
	},

	textLabel: {
		width: '25%',
		marginLeft: 20,
		marginRight: 20,
		fontSize: Theme.fontMedium,
		color: 'black',
	},

	inputLabelStyle: {
    fontSize: 11,
	},

	flex: {
		flexDirection: 'row',
		alignItems: 'center',

		marginTop: 20,
	},

	checkbox: {
		padding: 0, // checkbox container 안에 있는 checkbox의 padding 제거
		marginLeft: 25,
		backgroundColor: 'white', // checkbox container 색을 앱의 background와 일치시키기.
	},

	checkboxText: {
		fontSize: Theme.fontMediumSmall
	},

	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 25,
		marginTop: 15,
	},

	btn: {
		width: '25%',
	}
})
