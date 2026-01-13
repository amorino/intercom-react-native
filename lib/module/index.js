"use strict";

import { Platform } from 'react-native';
import { IntercomModule, IntercomEventEmitter } from "./nativeModules.js";
export let Visibility = /*#__PURE__*/function (Visibility) {
  Visibility["GONE"] = "GONE";
  Visibility["VISIBLE"] = "VISIBLE";
  return Visibility;
}({});
export let LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel["ASSERT"] = "ASSERT";
  LogLevel["DEBUG"] = "DEBUG";
  LogLevel["DISABLED"] = "DISABLED";
  LogLevel["ERROR"] = "ERROR";
  LogLevel["INFO"] = "INFO";
  LogLevel["VERBOSE"] = "VERBOSE";
  LogLevel["WARN"] = "WARN";
  return LogLevel;
}({});
export let ThemeMode = /*#__PURE__*/function (ThemeMode) {
  ThemeMode["LIGHT"] = "LIGHT";
  ThemeMode["DARK"] = "DARK";
  ThemeMode["SYSTEM"] = "SYSTEM";
  return ThemeMode;
}({});
export const IntercomEvents = {
  IntercomUnreadCountDidChange: IntercomEventEmitter.UNREAD_COUNT_CHANGE_NOTIFICATION,
  IntercomWindowDidHide: IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
  IntercomWindowDidShow: IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidShow: IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidHide: IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION
};
export let Space = /*#__PURE__*/function (Space) {
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
    const platform = Platform.OS;
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
    return IntercomModule.initialize(apiKey, appId);
  },
  loginUnidentifiedUser: () => IntercomModule.loginUnidentifiedUser(),
  loginUserWithUserAttributes: userAttributes => IntercomModule.loginUserWithUserAttributes(userAttributes),
  logout: () => IntercomModule.logout(),
  setUserHash: hash => IntercomModule.setUserHash(hash),
  updateUser: userAttributes => IntercomModule.updateUser(userAttributes),
  isUserLoggedIn: () => IntercomModule.isUserLoggedIn(),
  fetchLoggedInUserAttributes: () => IntercomModule.fetchLoggedInUserAttributes(),
  logEvent: (eventName, metaData = undefined) => IntercomModule.logEvent(eventName, metaData),
  fetchHelpCenterCollections: () => IntercomModule.fetchHelpCenterCollections(),
  fetchHelpCenterCollection: (id = '') => IntercomModule.fetchHelpCenterCollection(id),
  searchHelpCenter: (term = '') => IntercomModule.searchHelpCenter(term),
  present: () => IntercomModule.presentIntercom(),
  presentSpace: space => IntercomModule.presentIntercomSpace(space),
  presentContent: content => IntercomModule.presentContent(content),
  presentMessageComposer: (initialMessage = undefined) => IntercomModule.presentMessageComposer(initialMessage),
  getUnreadConversationCount: () => IntercomModule.getUnreadConversationCount(),
  hideIntercom: () => IntercomModule.hideIntercom(),
  setBottomPadding: paddingBottom => IntercomModule.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: visibility => IntercomModule.setInAppMessageVisibility(visibility),
  setLauncherVisibility: visibility => IntercomModule.setLauncherVisibility(visibility),
  setNeedsStatusBarAppearanceUpdate: Platform.select({
    ios: IntercomModule.setNeedsStatusBarAppearanceUpdate,
    default: async () => true
  }),
  handlePushMessage: Platform.select({
    android: IntercomModule.handlePushMessage,
    default: async () => true
  }),
  sendTokenToIntercom: token => IntercomModule.sendTokenToIntercom(token),
  setLogLevel: logLevel => IntercomModule.setLogLevel(logLevel),
  setThemeMode: themeMode => IntercomModule.setThemeMode(themeMode),
  setUserJwt: jwt => IntercomModule.setUserJwt(jwt),
  setAuthTokens: authTokens => IntercomModule.setAuthTokens(authTokens),
  bootstrapEventListeners: () => {
    if (Platform.OS === 'android' && IntercomEventEmitter?.startEventListener) {
      IntercomEventEmitter.startEventListener();
    }
    return () => {
      if (Platform.OS === 'android' && IntercomEventEmitter?.removeEventListener) {
        IntercomEventEmitter.removeEventListener();
      }
    };
  }
};
export default Intercom;
export let ContentType = /*#__PURE__*/function (ContentType) {
  ContentType["Article"] = "ARTICLE";
  ContentType["Carousel"] = "CAROUSEL";
  ContentType["Survey"] = "SURVEY";
  ContentType["HelpCenterCollections"] = "HELP_CENTER_COLLECTIONS";
  ContentType["Conversation"] = "CONVERSATION";
  return ContentType;
}({});
export const IntercomContent = {
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