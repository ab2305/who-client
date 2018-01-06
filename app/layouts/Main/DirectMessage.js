/* @flow */

import _ from 'lodash'
import moment from './../../../node_modules/moment/min/moment-with-locales.min.js'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { Icon } from 'react-native-elements'

import Theme from './../../config/styles'
import HttpRequestFactory from './../../base/HttpRequestFactory'
import firebase from './../../base/Firebase'

export default class DirectMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: []
    }
  }

	componentDidMount() {
		this.fetchDirectNotes()
    firebase.messaging().onMessage(() => this.fetchDirectNotes())
	}

  fetchDirectNotes = async () => {
    const res = await HttpRequestFactory.createRestClient('notes?limit=100&page=1', HttpRequestFactory.GET)
    const notes = res.data
    console.log('notes = ', notes)
    this.setState({ notes })
  }
  _renderHeader = (section) => {
    const date = moment(section.createdAt).locale('ko')

    const createdAt = date.fromNow()
    return (
      <View style={styles.item}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{section.title}</Text>
          <Text style={styles.headerSubText}>{createdAt}</Text>

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
    return (
      <View>
        <View style={styles.content}>
          <Text style={styles.contentText}>{section.body}</Text>
        </View>

        <View style={styles.hr} />
      </View>
    )
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.hr} />
          <Accordion
            sections={this.state.notes}
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

  item: {
  },

  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Theme.primaryTextColor,
  },

  headerSubText: {
    color: Theme.textPrimaryColor,
    marginRight: 20,
    alignSelf: 'center',
    fontSize: 10,
  },

  hr: {
    borderBottomColor: Theme.dividerColor,
    borderBottomWidth: 1,
  },

  content: {
    paddingLeft: 30,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Theme.defaultBackgroundColor
  },

  contentText: {
    fontSize: 14,
  },
})
