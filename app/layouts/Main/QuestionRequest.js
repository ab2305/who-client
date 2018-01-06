/* @flow */
import _ from 'lodash'
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native'

import config from './../../config/config-dev'
import ImagePicker from 'react-native-image-picker'
import RNUploader from 'react-native-uploader';
import Button from './../../components/Button'
import Theme from './../../config/styles'

import HttpRequestFactory from './../../base/HttpRequestFactory'

export default class QuestionRequest extends Component {
	constructor(props) {
		super(props)

    this.fileId = -1
    this.state = {
      text: '',
      fileUploadState: '첨부할 이미지가 있으면 여기를 눌러주세요'
    }
		this.navigation = this.props.navigation
  }

  doQuestion = async () => {
    try {
      const body = this.fileId == -1 ?
      { body: this.state.text } : { body: this.state.text, fileId: this.fileId }
      const res = await HttpRequestFactory.createRestClient(
        'question', HttpRequestFactory.POST, body
      )
      this.navigation.goBack(null)
    } catch (err) {
      console.log(err)
    }

  }

  doImageUpload = async () => {
    // open modal
    const options = {
      title: '이미지 선택',
      takePhotoButtonTitle: '사진 촬영',
      cancelButtonTitle: '취소',
      chooseFromLibraryButtonTitle: '갤러리에서 선택',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker')
				return
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error)
				return
			}

			let source = { uri: response.uri }
			console.log(response)
			this._doUpload(response)
		});

  }

  _doUpload = async (file) => {
    let files = [
      {
        name: 'file',
        filename: file.fileName,
        filepath: file.uri,
        filetype: file.type,
      },
    ]

    let opts = {
      url: config.api.url + '/file',
      files: files,
      method: 'POST',
    }

    RNUploader.upload(opts, (err, response) => {
			console.log('uploaded', err, response)
			if (err) {
				console.log(err);
				return;
			}

      var res;
      if (_.has(response, 'data')) {
        res = JSON.parse(response.data);
      } else {
        res = JSON.parse(response);
      }

			this.setState({fileUploadState: '이미지 업로드가 완료되었습니다.'})
      this.fileId = res.id
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{`
  자주 묻는 질문을 찾아보아도
  해결이 안되는 궁금증이 있다면
  1:1 문의하기를 이용해보세요.
            `}
          </Text>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.contentForm}
            onChangeText={(text) => this.setState({text})}
            editable = {true}
            multiline = {true}
            maxLength = {200}
            placeholder = "궁금한 점을 입력해주세요."
            value={this.state.text}
          />
          <Text style={styles.imageUploadForm} onPress={this.doImageUpload}>{this.state.fileUploadState}</Text>
          <Button btnText="제출" style={styles.btnStyle} onPress={this.doQuestion}></Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentForm: {
    height: 160,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 4,
    padding: 10,
    width: '70%'
  },

  imageUploadForm: {
    fontSize: 11,
    paddingBottom: 8,
    color: Theme.darkPrimaryColor
  },

  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.defaultBackgroundColor,
  },
})
