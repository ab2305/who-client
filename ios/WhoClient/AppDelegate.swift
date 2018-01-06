//
//  AppDelegate.swift
//  WhoClient
//
//  Created by 강재홍 on 2017. 9. 25..
//  Copyright © 2017년 Facebook. All rights reserved.
//

import UIKit
import UserNotifications
import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    
    if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().delegate = self
    }
    
    let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.ios", fallbackResource: nil)
    
    guard let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "WhoClient", initialProperties: nil, launchOptions: launchOptions) else {
      fatalError()
    }
    rootView.backgroundColor = UIColor.white
    
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    
    let window = UIWindow(frame: UIScreen.main.bounds)
    window.rootViewController = rootViewController
    
    self.window = window
    window.makeKeyAndVisible()
    
    SplashScreen.show()
    return true
  }
  
  func application(_ application: UIApplication, didReceive notification: UILocalNotification) {
    RNFirebaseMessaging.didReceive(notification)
  }
  
  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
    RNFirebaseMessaging.didReceiveRemoteNotification(userInfo)
  }
  
  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    RNFirebaseMessaging.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
  }
}

@available(iOS 10.0, *)
extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    RNFirebaseMessaging.willPresent(notification, withCompletionHandler: completionHandler)
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    RNFirebaseMessaging.didReceive(response, withCompletionHandler: completionHandler)
  }
}
