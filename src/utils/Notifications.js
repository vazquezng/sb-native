/* eslint-disable class-methods-use-this */
import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';

class Notifications {
  constructor() {
    // Setting requestPermissions
    const permissions = {
      alert: true,
      badge: true,
      sound: true
    };
    const self = this;
    OneSignal.requestPermissions(permissions);
    OneSignal.enableSound(true);
    OneSignal.enableVibrate(true);
    OneSignal.inFocusDisplaying(2);

    this.onReceived = (notification) => {
      console.log("Notification received: ", notification);
    }

    this.onOpened = (openResult) => {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);

      if (self.nav && self.nav.navigate) {
        self.nav.navigate('MatchDetail', { match: openResult.notification.payload.additionalData.id });
      }
    }

    this.onRegistered = (notifData) => {
      console.log("Device had been registered for push notifications!", notifData);
    }

    this.onIds = (device) => {
      self.device = device;
    }

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }

  getDevice() {
    return this.device;
  }

  setNavigation(navigation) {
    this.nav = navigation;
  }
}

export default new Notifications();
