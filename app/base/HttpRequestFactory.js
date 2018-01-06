import { ApolloClient, createNetworkInterface } from 'react-apollo';
import axios from 'axios'

import { api } from './../config/config-dev'
import { Observable } from 'rx'

// http://dev.apollodata.com/core/network.html
// middleware, afterware adapter
export default {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete',

	createGraphClient() {
		return new ApolloClient({
			networkInterface: createNetworkInterface({
				uri: api.graph,
			})
		})
	},

	createRxRestClient(url, method, body) {
		// async/await promise await
		return Observable.create((observer) => {
			this.createRestClient(url, method, body)
				.then((data) => {
					observer.onNext(data)
					observer.onCompleted()
				})
				.catch((err) => {
					observer.onError(err)
					observer.onCompleted()
				})
		})
	},

	createRestClient(url, method, body) {
		return this._createAsnycRestClient()(url, method, body)
	},

	_createAsnycRestClient() {
		const client = this._createRestClient()
		return async (url, method, body) =>
			await client[method](url, body)
	},

	_createRestClient() {
		return axios.create({
			baseURL: api.url,
			timeout: 10000,
		})
	}
}
