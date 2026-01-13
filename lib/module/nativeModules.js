"use strict";

import { NativeModules, TurboModuleRegistry } from 'react-native';
function isTurboModuleAvailable(name) {
  try {
    return TurboModuleRegistry.get(name) != null;
  } catch {
    return false;
  }
}
export const IntercomModule = isTurboModuleAvailable('IntercomModule') ? require('./NativeIntercomSpec').default : NativeModules.IntercomModule;
export const IntercomEventEmitter = NativeModules.IntercomEventEmitter;
//# sourceMappingURL=nativeModules.js.map