/* @flow */

import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager'

import Button from './../../components/Button'
import Theme from './../../config/styles'

export default class Guide extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
	})

  constructor(props) {
    super(props)
		this.navigation = this.props.navigation
    this.loggedIn = this.props.navigation.state.params && this.props.navigation.state.params.loggedIn ?
      this.props.navigation.state.params.loggedIn : false
  }

  _renderDotIndicator = () => {
    return <PagerDotIndicator
            dotStyle={{backgroundColor: '#FFFFFF88'}}
            style={{bottom: 16}}
            pageCount={2} />
  }

  startApp = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    const title = `
    - 짝사랑 하는 사람에게
    - 헤어진 옛 연인에게
    - 마니또 친구에게
    - 키다리아저씨가 되어 주고 싶은 사람에게
    - 멘토가 되어 주고 싶은 멘티에게

    이처럼 내가 아는 그 사람이랑 대화를 나누고는 싶은데
    나를 드러내고 싶지는 않을 때가 있지 않나요?

    이제 누굴까로 마음 편하게 채팅을 해보세요
    상대방은 당신의 정체를 절대 알 수 없습니다
    당신이 밝히지만 않는다면요
    `

    return (
      <View style={styles.container}>
        <IndicatorViewPager
          style={{flex: 1}}
          indicator={this._renderDotIndicator()}
        >
          <View style={[styles.guideContainer]}>
            <Image style={styles.headerImage} source={require('./../../images/launcher.png')} />
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <Image style={[styles.homeContainer, styles.mainImage]}
              source={require('./../../images/chatlist.png')} >
            <View style={styles.absoluteContainer}>
              {
                !this.loggedIn &&
                <Button
                btnText="시작하기"
                customStyle={styles.startButton}
                onPress={this.startApp}></Button>
              }
            </View>
          </Image>
        </IndicatorViewPager>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38AEFD'
  },

  guideContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerImage: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginTop: 50,
    marginBottom: 0,
  },

  mainImage: {
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 50,
    color: 'white',
  },

  homeContainer: {

  },

  chatroomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  absoluteContainer: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    zIndex: 99,
    backgroundColor: Theme.primaryTextColor,
    borderRadius: 10,
  },

  startButton: {
    width: 120,
    height: 40,
    backgroundColor: Theme.primaryTextColor,
    zIndex: 100,
  }


})
