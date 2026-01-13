"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withIntercomPushNotification = void 0;
var _configPlugins = require("@expo/config-plugins");
var _codeMod = require("@expo/config-plugins/build/ios/codeMod");
const appDelegate = _config => (0, _configPlugins.withAppDelegate)(_config, config => {
  const setDeviceTokenCode = '[IntercomModule setDeviceToken:deviceToken];';
  let stringContents = config.modResults.contents;
  const didRegisterBlock = (0, _codeMod.findObjcFunctionCodeBlock)(stringContents, 'application didRegisterForRemoteNotificationsWithDeviceToken:');
  if (!didRegisterBlock?.code.includes(setDeviceTokenCode)) {
    stringContents = (0, _codeMod.insertContentsInsideObjcFunctionBlock)(stringContents, 'application didRegisterForRemoteNotificationsWithDeviceToken:', setDeviceTokenCode, {
      position: 'tailBeforeLastReturn'
    });
  }
  config.modResults.contents = stringContents;
  return config;
});
const infoPlist = _config => {
  const newConfig = (0, _configPlugins.withInfoPlist)(_config, config => {
    const keys = {
      remoteNotification: 'remote-notification'
    };
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }
    if (config.modResults.UIBackgroundModes?.indexOf(keys.remoteNotification) === -1) {
      config.modResults.UIBackgroundModes?.push(keys.remoteNotification);
    }
    return config;
  });
  return newConfig;
};
const withIntercomPushNotification = (config, props) => {
  let newConfig = config;
  newConfig = appDelegate(config, props);
  newConfig = infoPlist(config, props);
  return newConfig;
};
exports.withIntercomPushNotification = withIntercomPushNotification;
//# sourceMappingURL=withPushNotifications.js.map