/* @flow */

import moment from './../../../node_modules/moment/min/moment-with-locales.min.js'
import _ from 'lodash'
import React, { Component } from 'react'

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import Accordion from 'react-native-collapsible/Accordion'
import Button from './../../components/Button'
import { Icon } from 'react-native-elements'
import AutoHeightImage from 'react-native-auto-height-image'

import Theme from './../../config/styles'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import firebase from './../../base/Firebase'

export default class Question extends Component {
	constructor(props) {
		super(props)

    this.state = {
      questions: [{
       body: '-',
      }]
    }
		this.navigation = this.props.navigation
  }

  doQuestion = () => {
    // open modal
    this.navigation.navigate('QuestionRequest')
  }

  _renderHeader = (section) => {
    const date = moment(section.createdAt).locale('ko')

    const createdAt = date.fromNow()
    let title = section.body.length > 10 ?
      section.body.substring(0, 8) + '...' : section.body
    if(section.comment) {
      title = '[답변 완료] '+ title
    }

    return (
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemHeaderText}>{title}</Text>
          <Text style={styles.itemHeaderSubText}>{createdAt}</Text>

          <Icon
    				name='angle-right'
    				color={ Theme.textPrimaryColor }
    				type='font-awesome'
    				size={20} />
        </View>
        <View style={styles.hr} />
      </View>
    )
  }

  _renderContent = (section) => {
    console.log('renderContent')
    const FileComponent = () => {
      if(section.file) {
        console.log('has file', section.file)
        return (
          <AutoHeightImage width={300}
    				imageURL={section.file.url} />
        )
      }
      return (<View />)
    }

    const CommentComponent = () => {
      if(section.comment) {
        return (
          <View>
            <View style={[styles.hr, styles.itemComponent]} />
            <Text style={styles.itemContentText}>{section.comment}</Text>
          </View>
        )
      }
      return (<View />)
    }
    return (
      <View>
        <View style={styles.itemContent}>
          <Text style={styles.itemContentText}>{section.body}</Text>
          <FileComponent />
          <CommentComponent />
        </View>

        <View style={styles.hr} />
      </View>
    )
  }

  componentDidMount() {
    this.fetchQuestions()
    firebase.messaging().onMessage(() => this.fetchQuestions())
  }

  fetchQuestions = async () => {
    const res = await HttpRequestFactory.createRestClient('questions?limit=100&page=1&top=true', HttpRequestFactory.GET)
    const questions = res.data
    console.log('questions = ', questions)
    this.setState({ questions })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{`
자주 묻는 질문을 찾아보아도
해결이 안되는 궁금증이 있다면
1:1 문의하기를 이용해보세요.
            `}
          </Text>

          <Button btnText="1:1 문의하기" style={styles.btnStyle} onPress={this.doQuestion}></Button>
        </View>

        <View style={styles.content}>
          <Accordion
            sections={this.state.questions}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.defaultBackgroundColor,
  },

  headerText: {

  },

  content: {
  },

  itemHeader: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  itemHeaderText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Theme.primaryTextColor,
  },

  itemHeaderSubText: {
    color: Theme.textPrimaryColor,
    alignSelf: 'center',
    marginRight: 20,
    fontSize: 10,
  },

  hr: {
    borderBottomColor: Theme.dividerColor,
    borderBottomWidth: 1,
  },

  itemContent: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Theme.defaultBackgroundColor
  },

  itemComponent: {
    paddingTop: 2,
    paddingBottom: 2,
  },

  itemContentText: {
    fontSize: 14,
    paddingBottom: 4,
    paddingTop: 4,
  },
})
