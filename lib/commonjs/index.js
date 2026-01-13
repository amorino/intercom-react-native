"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Visibility = exports.ThemeMode = exports.Space = exports.LogLevel = exports.IntercomEvents = exports.IntercomContent = exports.ContentType = void 0;
var _reactNative = require("react-native");
var _nativeModules = require("./nativeModules.js");
let Visibility = exports.Visibility = /*#__PURE__*/function (Visibility) {
  Visibility["GONE"] = "GONE";
  Visibility["VISIBLE"] = "VISIBLE";
  return Visibility;
}({});
let LogLevel = exports.LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel["ASSERT"] = "ASSERT";
  LogLevel["DEBUG"] = "DEBUG";
  LogLevel["DISABLED"] = "DISABLED";
  LogLevel["ERROR"] = "ERROR";
  LogLevel["INFO"] = "INFO";
  LogLevel["VERBOSE"] = "VERBOSE";
  LogLevel["WARN"] = "WARN";
  return LogLevel;
}({});
let ThemeMode = exports.ThemeMode = /*#__PURE__*/function (ThemeMode) {
  ThemeMode["LIGHT"] = "LIGHT";
  ThemeMode["DARK"] = "DARK";
  ThemeMode["SYSTEM"] = "SYSTEM";
  return ThemeMode;
}({});
const IntercomEvents = exports.IntercomEvents = {
  IntercomUnreadCountDidChange: _nativeModules.IntercomEventEmitter.UNREAD_COUNT_CHANGE_NOTIFICATION,
  IntercomWindowDidHide: _nativeModules.IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
  IntercomWindowDidShow: _nativeModules.IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidShow: _nativeModules.IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidHide: _nativeModules.IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION
};
let Space = exports.Space = /*#__PURE__*/function (Space) {
  Space["home"] = "HOME";
  Space["helpCenter"] = "HELP_CENTER";
  Space["messages"] = "MESSAGES";
  Space["tickets"] = "TICKETS";
  return Space;
}({});
const Intercom = {
  initialize: (apiKey, appId) => {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return Promise.reject(new Error('Intercom: apiKey is required and must be a string'));
    }
    if (!appId || typeof appId !== 'string' || appId.trim() === '') {
      return Promise.reject(new Error('Intercom: appId is required and must be a string'));
    }
    const platform = _reactNative.Platform.OS;
    const platformRules = {
      ios: {
        prefix: 'ios_sdk-',
        minLength: 48
      },
      android: {
        prefix: 'android_sdk-',
        minLength: 52
      }
    };
    const rules = platformRules[platform];
    if (!rules) {
      return Promise.reject(new Error(`Intercom: Platform "${platform}" is not supported. Only iOS and Android are supported.`));
    }
    if (!apiKey.startsWith(rules.prefix)) {
      return Promise.reject(new Error(`Intercom: ${platform} API key must start with "${rules.prefix}"`));
    }
    if (apiKey.length < rules.minLength) {
      return Promise.reject(new Error(`Intercom: ${platform} API key must be at least ${rules.minLength} characters long`));
    }
    return _nativeModules.IntercomModule.initialize(apiKey, appId);
  },
  loginUnidentifiedUser: () => _nativeModules.IntercomModule.loginUnidentifiedUser(),
  loginUserWithUserAttributes: userAttributes => _nativeModules.IntercomModule.loginUserWithUserAttributes(userAttributes),
  logout: () => _nativeModules.IntercomModule.logout(),
  setUserHash: hash => _nativeModules.IntercomModule.setUserHash(hash),
  updateUser: userAttributes => _nativeModules.IntercomModule.updateUser(userAttributes),
  isUserLoggedIn: () => _nativeModules.IntercomModule.isUserLoggedIn(),
  fetchLoggedInUserAttributes: () => _nativeModules.IntercomModule.fetchLoggedInUserAttributes(),
  logEvent: (eventName, metaData = undefined) => _nativeModules.IntercomModule.logEvent(eventName, metaData),
  fetchHelpCenterCollections: () => _nativeModules.IntercomModule.fetchHelpCenterCollections(),
  fetchHelpCenterCollection: (id = '') => _nativeModules.IntercomModule.fetchHelpCenterCollection(id),
  searchHelpCenter: (term = '') => _nativeModules.IntercomModule.searchHelpCenter(term),
  present: () => _nativeModules.IntercomModule.presentIntercom(),
  presentSpace: space => _nativeModules.IntercomModule.presentIntercomSpace(space),
  presentContent: content => _nativeModules.IntercomModule.presentContent(content),
  presentMessageComposer: (initialMessage = undefined) => _nativeModules.IntercomModule.presentMessageComposer(initialMessage),
  getUnreadConversationCount: () => _nativeModules.IntercomModule.getUnreadConversationCount(),
  hideIntercom: () => _nativeModules.IntercomModule.hideIntercom(),
  setBottomPadding: paddingBottom => _nativeModules.IntercomModule.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: visibility => _nativeModules.IntercomModule.setInAppMessageVisibility(visibility),
  setLauncherVisibility: visibility => _nativeModules.IntercomModule.setLauncherVisibility(visibility),
  setNeedsStatusBarAppearanceUpdate: _reactNative.Platform.select({
    ios: _nativeModules.IntercomModule.setNeedsStatusBarAppearanceUpdate,
    default: async () => true
  }),
  handlePushMessage: _reactNative.Platform.select({
    android: _nativeModules.IntercomModule.handlePushMessage,
    default: async () => true
  }),
  sendTokenToIntercom: token => _nativeModules.IntercomModule.sendTokenToIntercom(token),
  setLogLevel: logLevel => _nativeModules.IntercomModule.setLogLevel(logLevel),
  setThemeMode: themeMode => _nativeModules.IntercomModule.setThemeMode(themeMode),
  setUserJwt: jwt => _nativeModules.IntercomModule.setUserJwt(jwt),
  setAuthTokens: authTokens => _nativeModules.IntercomModule.setAuthTokens(authTokens),
  bootstrapEventListeners: () => {
    if (_reactNative.Platform.OS === 'android' && _nativeModules.IntercomEventEmitter?.startEventListener) {
      _nativeModules.IntercomEventEmitter.startEventListener();
    }
    return () => {
      if (_reactNative.Platform.OS === 'android' && _nativeModules.IntercomEventEmitter?.removeEventListener) {
        _nativeModules.IntercomEventEmitter.removeEventListener();
      }
    };
  }
};
var _default = exports.default = Intercom;
let ContentType = exports.ContentType = /*#__PURE__*/function (ContentType) {
  ContentType["Article"] = "ARTICLE";
  ContentType["Carousel"] = "CAROUSEL";
  ContentType["Survey"] = "SURVEY";
  ContentType["HelpCenterCollections"] = "HELP_CENTER_COLLECTIONS";
  ContentType["Conversation"] = "CONVERSATION";
  return ContentType;
}({});
const IntercomContent = exports.IntercomContent = {
  articleWithArticleId(articleId) {
    let articleContent = {};
    articleContent.type = ContentType.Article;
    articleContent.id = articleId;
    return articleContent;
  },
  carouselWithCarouselId(carouselId) {
    let carouselContent = {};
    carouselContent.type = ContentType.Carousel;
    carouselContent.id = carouselId;
    return carouselContent;
  },
  surveyWithSurveyId(surveyId) {
    let surveyContent = {};
    surveyContent.type = ContentType.Survey;
    surveyContent.id = surveyId;
    return surveyContent;
  },
  helpCenterCollectionsWithIds(collectionIds) {
    let helpCenterCollectionsContent = {};
    helpCenterCollectionsContent.type = ContentType.HelpCenterCollections;
    helpCenterCollectionsContent.ids = collectionIds;
    return helpCenterCollectionsContent;
  },
  conversationWithConversationId(conversationId) {
    let conversationContent = {};
    conversationContent.type = ContentType.Conversation;
    conversationContent.id = conversationId;
    return conversationContent;
  }
};
//# sourceMappingURL=index.js.map