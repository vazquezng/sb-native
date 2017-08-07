import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    margin: -1,
  },
  itemText: {
    fontSize: 14,
  },
  itemTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
    paddingRight: 24,
    paddingLeft: 24,
  },
  itemIconContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: 'rgba(127, 127, 127, 0.5)',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
    borderRadius: 2,
  },
  modalClose: {
    alignItems: 'flex-end',
    height: 10,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
