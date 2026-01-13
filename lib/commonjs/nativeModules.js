"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntercomModule = exports.IntercomEventEmitter = void 0;
var _reactNative = require("react-native");
function isTurboModuleAvailable(name) {
  try {
    return _reactNative.TurboModuleRegistry.get(name) != null;
  } catch {
    return false;
  }
}
const IntercomModule = exports.IntercomModule = isTurboModuleAvailable('IntercomModule') ? require('./NativeIntercomSpec').default : _reactNative.NativeModules.IntercomModule;
const IntercomEventEmitter = exports.IntercomEventEmitter = _reactNative.NativeModules.IntercomEventEmitter;
//# sourceMappingURL=nativeModules.js.map