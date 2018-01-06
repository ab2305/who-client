import { Platform, NativeModules } from 'react-native';
import InAppBilling from 'react-native-billing'
const { InAppUtils } = NativeModules

import HttpRequestFactory from './../base/HttpRequestFactory'

const purchaseStamp = async (productId, navigation) => {
  console.log('purchaseStamp')
  if (Platform.OS === 'android') {
    try {
      await InAppBilling.open()
      const details = await InAppBilling.purchase(productId)
      console.log("details: ", details)

      details.productId = productId
      await InAppBilling.consumePurchase(subscriptionId)

      const res = await HttpRequestFactory.createRestClient('/me/item', HttpRequestFactory.POST, details)
      navigation.goBack(null)
    } catch (err) {
      console.log(err)
    } finally {
      await InAppBilling.close()
    }
    return
  }

  // iosR
  const productIdentifier = 'stamp_33' // test
  InAppUtils.loadProducts([productIdentifier], (error, products) => {
  	//update store here.
  	console.log('end load', products, error)
  	InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
		  console.log('end purchase', response, error)
		   if(response && response.productIdentifier) {
		   }
		});
  });
}
const purchaseSubscription = async (subscriptionId, navigation) => {
  if (Platform.OS === 'android') {
    try {
      await InAppBilling.open()
      const details = await InAppBilling.purchase(subscriptionId)
      console.log('details: ', details)

      details.productId = subscriptionId
      await InAppBilling.consumePurchase(subscriptionId)

      const res = await HttpRequestFactory.createRestClient('/me/item', HttpRequestFactory.POST, details)
      navigation.goBack(null)
    } catch (err) {
      console.log(err)
    } finally {
      // await InAppBilling.consumePurchase(productId);
      await InAppBilling.close();
    }
    return
  }

  // iosR
  const productIdentifier = 'subscription_30' // test
  InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
    console.log('end purchase', response, error)
     if(response && response.productIdentifier) {
     }
  });
}

const payment = {
  purchaseStamp, purchaseSubscription
}

export default payment;
