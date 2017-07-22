import { StyleSheet, Platform } from 'react-native';

module.exports = StyleSheet.create({
  modalFiltroContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  modalFiltroHeader: {
    height: Platform.OS === 'ios' ? 44 : 56,
    flexDirection: 'row',
    backgroundColor: '#3F78C3',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  modalFiltroHeaderTitle: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFiltroHeaderTitleText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
  },
  modalFiltroHeaderIconContainer: {
    flex: 0.20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalFiltroContent: {
    flex: 1,
  },
  modalFiltroCloseContainer: {
    flex: 0.20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalFiltroSuccessContainer: {
    height: Platform.OS === 'ios' ? 44 : 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F78C3',
  },
  modalFiltroSucccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFiltroClearContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFiltroClearText: {
    marginLeft: 16,
    color: 'white',
    fontSize: 16,
  },
  modalFiltroSucccessText: {
    color: 'white',
    fontSize: 18,
  },
});
