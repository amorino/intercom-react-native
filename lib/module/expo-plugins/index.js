"use strict";

import { AndroidConfig, createRunOncePlugin, withAndroidManifest, withAppDelegate, withInfoPlist, withMainApplication } from '@expo/config-plugins';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import { addImports, appendContentsInsideDeclarationBlock } from '@expo/config-plugins/build/android/codeMod';
import { addObjcImports, insertContentsInsideObjcFunctionBlock, insertContentsInsideSwiftFunctionBlock } from '@expo/config-plugins/build/ios/codeMod';
import { withIntercomPushNotification } from "./withPushNotifications.js";
const mainApplication = (_config, props) => withMainApplication(_config, config => {
  let stringContents = config.modResults.contents;
  stringContents = addImports(stringContents, ['com.intercom.reactnative.IntercomModule'], config.modResults.language === 'java');

  // Remove previous code
  stringContents = stringContents.replace(/IntercomModule\.initialize\(.*?\)\s*;?\n?/g, '');
  if (!props.useManualInit) {
    stringContents = appendContentsInsideDeclarationBlock(stringContents, 'onCreate', `IntercomModule.initialize(this, "${props.androidApiKey}", "${props.appId}")${config.modResults.language === 'java' ? ';' : ''}\n`);
  }
  config.modResults.contents = stringContents;
  return config;
});
const androidManifest = (_config, {
  intercomRegion = 'US'
}) => {
  let newConfig = AndroidConfig.Permissions.withPermissions(_config, ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.VIBRATE'].filter(Boolean));
  newConfig = withAndroidManifest(newConfig, config => {
    const currentMainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const androidRegionMapper = {
      US: '@integer/intercom_server_region_us',
      EU: '@integer/intercom_server_region_eu',
      AU: '@integer/intercom_server_region_aus'
    };
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(currentMainApplication, 'io.intercom.android.sdk.server.region', androidRegionMapper[intercomRegion]);
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
const appDelegate = (_config, props) => withAppDelegate(_config, config => {
  let stringContents = config.modResults.contents;
  const isSwift = config.modResults.language === 'swift';
  stringContents = isSwift ? mergeContents({
    src: stringContents,
    newSrc: 'import intercom_react_native',
    comment: '//',
    tag: 'Intercom header',
    anchor: /import Expo/,
    offset: 1
  }).contents : addObjcImports(stringContents, ['<IntercomModule.h>']);

  // Remove previous code
  stringContents = stringContents.replace(/\s*\[IntercomModule initialize:@"(.*)" withAppId:@"(.*)"];/g, '').replace(/\s*IntercomModule\.initialize\((.*), withAppId: (.*)\)/g, '');
  if (!props.useManualInit) {
    stringContents = isSwift ? insertContentsInsideSwiftFunctionBlock(stringContents, 'application(_:didFinishLaunchingWithOptions:)', `IntercomModule.initialize("${props.iosApiKey}", withAppId: "${props.appId}")`, {
      position: 'tailBeforeLastReturn'
    }) : insertContentsInsideObjcFunctionBlock(stringContents, 'application didFinishLaunchingWithOptions:', `[IntercomModule initialize:@"${props.iosApiKey}" withAppId:@"${props.appId}"];`, {
      position: 'tailBeforeLastReturn'
    });
  }
  config.modResults.contents = stringContents;
  return config;
});
const infoPlist = (_config, {
  intercomRegion
}) => {
  const newConfig = withInfoPlist(_config, config => {
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
  newConfig = withIntercomPushNotification(newConfig, props);
  return newConfig;
};
const configPlugin = pkg => createRunOncePlugin(withIntercomReactNative, pkg.name, pkg.version);
export default configPlugin;
//# sourceMappingURL=index.js.map