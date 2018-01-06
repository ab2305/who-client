package com.whoclient;

import android.app.Application;
import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.smixx.fabric.FabricPackage;
import io.fabric.sdk.android.Fabric;
import com.crashlytics.android.Crashlytics;

import io.invertase.firebase.RNFirebasePackage; // <-- Add this line
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging
import com.burlap.filetransfer.FileTransferPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

	private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
		@Override
		public boolean getUseDeveloperSupport() {
			return BuildConfig.DEBUG;
		}

		@Override
		protected List<ReactPackage> getPackages() {
			return Arrays.<ReactPackage>asList(
				new MainReactPackage(),
        new SplashScreenReactPackage(),
				new ImagePickerPackage(),
				new FileTransferPackage(),
				// new InAppBillingBridgePackage(null),
				new InAppBillingBridgePackage("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAumnkq53r8cFlrIAk1mJBhCjETdUmeqe7LROVUdjbwQnB07EhrQL51qPGnqQJEO7dfPnSCzrUMNrK6JMg23e3GbDN+AG70ZtUYA75pTREjLtYNDznUStFZ0/JmXj7Wa2fs/vMeMPPAtvUBfBrvvjiqi/gRtGzwvLuQmmsCPEG4t+FnOQFqeeiHeb0JYe579VrY8xYPLpBHzHqq0WUBxclt7P9Vv8clyE4zcRxQx4JNsy6gQ9ltf/cMrnNyWKn1GWEH71A8wHLE9Ay27EqHbCSrL1le9l1qtQkop1MvDYmN+rxlt9NAQVp4jK1CV6K7QKVQUH3tUMj1Dt+47USZ10rgwIDAQAB"),
				new VectorIconsPackage(),
				new RNFirebasePackage(),
				new FabricPackage(),
				new RNFirebaseMessagingPackage()
			);
		}
	};

	@Override
	public ReactNativeHost getReactNativeHost() {
		return mReactNativeHost;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
		Fabric.with(this, new Crashlytics());
	}
}
