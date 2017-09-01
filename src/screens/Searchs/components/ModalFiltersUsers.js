/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Text, Slider } from 'react-native';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ModalFullSHOC from '@components/ModalFullS';
import TouchableItem from '@components/TouchableItem';
import PickerSB from '@components/Picker';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import commonFunc from '@utils/commonFunc';

const enhance = compose(
  ModalFullSHOC()
);

@enhance
export default class ModalFiltersUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters,
    };
  }

  renderYear() {
    const { filters } = this.state;
    return (
      <View>
        <View style={{marginTop: 10}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>EDAD</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'black' }]}>DESDE</Text>
            <Text style={[Styles.inputText, { color: '#079ac8' }]}>{filters.years_from}</Text>
          </View>
        </View>
        <View style={[Styles.flexRow]}>
          <View style={[Styles.flexColumn, { width: Metrics.width }]}>
            <Slider
              style={{ width: Metrics.width, height: 33 }}
              minimumValue={18}
              maximumValue={99}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(filters.years_from)}
              onValueChange={years_from => this.setState({ filters: Object.assign(filters, { years_from }) })} />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'black' }]}>HASTA</Text>
            <Text style={[Styles.inputText, { color: '#079ac8' }]}>{filters.years_to}</Text>
          </View>
        </View>
        <View style={[Styles.flexRow]}>
          <View style={[Styles.flexColumn, { width: Metrics.width }]}>
            <Slider
              style={{ width: Metrics.width, height: 33 }}
              minimumValue={18}
              maximumValue={99}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(filters.years_to)}
              onValueChange={years_to => this.setState({ filters: Object.assign(filters, { years_to }) })}
            />
          </View>
        </View>
      </View>
    );
  }

  renderLevelAndSexo() {
    const { filters } = this.state;

    let valueGameLevelFrom = commonFunc.pickerGameLevel.find(pgl => pgl.value === filters.game_level_from);
    valueGameLevelFrom = valueGameLevelFrom ? valueGameLevelFrom.label : '2.5';
    let valueGameLevelTo = commonFunc.pickerGameLevel.find(pgl => pgl.value === filters.game_level_to);
    valueGameLevelTo = valueGameLevelTo ? valueGameLevelTo.label : '2.5';
    let valueSexo = commonFunc.pickerSexo.find(ps => ps.value === filters.sexo);
    valueSexo = valueSexo ? valueSexo.label : 'Mixto';

    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>NIVEL DE JUEGO</Text>
        </View>
        <View style={[Styles.flexRow, { marginTop: 20 }]}>
          <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.pickerContainer, { width: Metrics.width/2 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
              selectedValue={valueGameLevelFrom.toString()}
              list={commonFunc.pickerGameLevel}
              onSelectValue={game_level_from => this.setState({ filters: Object.assign(filters, { game_level_from: game_level_from.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2 }]}>DESDE</Text>
          </View>
          <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.pickerContainer, { width: Metrics.width/2 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
              selectedValue={valueGameLevelTo.toString()}
              list={commonFunc.pickerGameLevel}
              onSelectValue={game_level_to => this.setState({ filters: Object.assign(filters, { game_level_to: game_level_to.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2 }]}>HASTA</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>SEXO</Text>
        </View>
        <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
          <PickerSB
            containerStyle={[ Styles.pickerContainer, { width: Metrics.width }]}
            buttonStyle={{ height: 40, justifyContent: 'center' }}
            textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
            selectedValue={valueSexo}
            list={commonFunc.pickerSexo}
            onSelectValue={sexo => this.setState({ filters: Object.assign(filters, { sexo: sexo.value }) })}
          />
        </View>
      </View>
    );
  }

  render() {
    const { onSuccess } = this.props;
    const { filters } = this.state;
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
        <View>
          <Text style={Styles.title}>Filtro de usuarios</Text>
        </View>

        <View style={Styles.flexColumn}>
          {this.renderYear()}
          {this.renderLevelAndSexo()}
        </View>
        <View style={[Styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
          <TouchableItem
            pointerEvents="box-only"
            accessibilityComponentType="button"
            accessibilityTraits="button"
            testID="profile-available"
            delayPressIn={0}
            style={Styles.btnSave}
            onPress={() => onSuccess(filters)}
            pressColor={Colors.primary}
          >
            <View pointerEvents="box-only">
              <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>GUARDAR</Text>
            </View>
          </TouchableItem>
        </View>
      </ScrollView>
    );
  }
}
