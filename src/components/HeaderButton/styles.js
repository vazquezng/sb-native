import { StyleSheet, Platform, I18nManager } from 'react-native';

module.exports = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios' ? {
    marginLeft: 10,
    marginRight: 22,
    marginVertical: 12,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  } : {
    margin: 16,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconWithTitle: Platform.OS === 'ios' ? {
    marginRight: 5,
  } : {},
});
