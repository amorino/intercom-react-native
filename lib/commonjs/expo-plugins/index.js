"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _configPlugins = require("@expo/config-plugins");
var _generateCode = require("@expo/config-plugins/build/utils/generateCode");
var _codeMod = require("@expo/config-plugins/build/android/codeMod");
var _codeMod2 = require("@expo/config-plugins/build/ios/codeMod");
var _withPushNotifications = require("./withPushNotifications.js");
const mainApplication = (_config, props) => (0, _configPlugins.withMainApplication)(_config, config => {
  let stringContents = config.modResults.contents;
  stringContents = (0, _codeMod.addImports)(stringContents, ['com.intercom.reactnative.IntercomModule'], config.modResults.language === 'java');

  // Remove previous code
  stringContents = stringContents.replace(/IntercomModule\.initialize\(.*?\)\s*;?\n?/g, '');
  if (!props.useManualInit) {
    stringContents = (0, _codeMod.appendContentsInsideDeclarationBlock)(stringContents, 'onCreate', `IntercomModule.initialize(this, "${props.androidApiKey}", "${props.appId}")${config.modResults.language === 'java' ? ';' : ''}\n`);
  }
  config.modResults.contents = stringContents;
  return config;
});
const androidManifest = (_config, {
  intercomRegion = 'US'
}) => {
  let newConfig = _configPlugins.AndroidConfig.Permissions.withPermissions(_config, ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.VIBRATE'].filter(Boolean));
  newConfig = (0, _configPlugins.withAndroidManifest)(newConfig, config => {
    const currentMainApplication = _configPlugins.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const androidRegionMapper = {
      US: '@integer/intercom_server_region_us',
      EU: '@integer/intercom_server_region_eu',
      AU: '@integer/intercom_server_region_aus'
    };
    _configPlugins.AndroidConfig.Manifest.addMetaDataItemToMainApplication(currentMainApplication, 'io.intercom.android.sdk.server.region', androidRegionMapper[intercomRegion]);
    return config;
  });
  return newConfig;
};
const withIntercomAndroid = (config, props) => {
  let newConfig = config;
  newConfig = mainApplication(newConfig, props);
  newConfig = androidManifest(newConfig, props);
  return newConfig;
};
const appDelegate = (_config, props) => (0, _configPlugins.withAppDelegate)(_config, config => {
  let stringContents = config.modResults.contents;
  const isSwift = config.modResults.language === 'swift';
  stringContents = isSwift ? (0, _generateCode.mergeContents)({
    src: stringContents,
    newSrc: 'import intercom_react_native',
    comment: '//',
    tag: 'Intercom header',
    anchor: /import Expo/,
    offset: 1
  }).contents : (0, _codeMod2.addObjcImports)(stringContents, ['<IntercomModule.h>']);

  // Remove previous code
  stringContents = stringContents.replace(/\s*\[IntercomModule initialize:@"(.*)" withAppId:@"(.*)"];/g, '').replace(/\s*IntercomModule\.initialize\((.*), withAppId: (.*)\)/g, '');
  if (!props.useManualInit) {
    stringContents = isSwift ? (0, _codeMod2.insertContentsInsideSwiftFunctionBlock)(stringContents, 'application(_:didFinishLaunchingWithOptions:)', `IntercomModule.initialize("${props.iosApiKey}", withAppId: "${props.appId}")`, {
      position: 'tailBeforeLastReturn'
    }) : (0, _codeMod2.insertContentsInsideObjcFunctionBlock)(stringContents, 'application didFinishLaunchingWithOptions:', `[IntercomModule initialize:@"${props.iosApiKey}" withAppId:@"${props.appId}"];`, {
      position: 'tailBeforeLastReturn'
    });
  }
  config.modResults.contents = stringContents;
  return config;
});
const infoPlist = (_config, {
  intercomRegion
}) => {
  const newConfig = (0, _configPlugins.withInfoPlist)(_config, config => {
    if (intercomRegion) {
      config.modResults.IntercomRegion = intercomRegion;
    }
    return config;
  });
  return newConfig;
};
const withIntercomIOS = (config, props) => {
  let newConfig = appDelegate(config, props);
  newConfig = infoPlist(newConfig, props);
  return newConfig;
};
const withIntercomReactNative = (config, props) => {
  let newConfig = config;
  newConfig = withIntercomAndroid(newConfig, props);
  newConfig = withIntercomIOS(newConfig, props);
  newConfig = (0, _withPushNotifications.withIntercomPushNotification)(newConfig, props);
  return newConfig;
};
const configPlugin = pkg => (0, _configPlugins.createRunOncePlugin)(withIntercomReactNative, pkg.name, pkg.version);
var _default = exports.default = configPlugin;
//# sourceMappingURL=index.js.map