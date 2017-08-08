/* eslint-disable react/prop-types */

import React from 'react';
import { View, Alert, ScrollView, Text, Switch, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ModalFullSHOC from '@components/ModalFullS';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

const enhance = compose(
  ModalFullSHOC()
);

@enhance
export default class CustomPlan extends React.Component {
  constructor(props) {
    super(props);
console.log(props.availability);
    this.state = {
      availability: props.availability,
    };
  }

  setAvailability(day, rango, value) {
    const { availability } = this.state;
    let key = 0;
    availability.forEach((a, index) => {
      if (parseInt(a.day) === day) {
        key = index;
      }
    });

    if (rango === 'allDay') {
      availability[key].allDay = value;
      availability[key].evening = value;
      availability[key].morning = value;
      availability[key].night = value;
    } else {
      availability[key][rango] = value;

      if (!value) {
        availability[key].allDay = value;
      }
    }

    this.setState({ availability });
  }

  render() {
    const { onSuccess } = this.props;
    const { availability } = this.state;
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
        <View>
          <Text style={Styles.title}>Disponibilidad</Text>
        </View>
        <ScrollView style={{ flex: 1}} showsHorizontalScrollIndicator={true}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text></Text>
              <Text style={{ paddingTop: 20 }}>8 A 23HS.</Text>
              <Text style={{ paddingTop: 20 }}>8 A 12HS.</Text>
              <Text style={{ paddingTop: 20 }}>12 A 19HS.</Text>
              <Text style={{ paddingTop: 20 }}>19 A 23HS.</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Lun.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[0].allDay)}
                  onValueChange={(value) => this.setAvailability(0, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[0].morning)}
                  onValueChange={(value) => this.setAvailability(0, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[0].evening)}
                  onValueChange={(value) => this.setAvailability(0, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[0].night)}
                  onValueChange={(value) => this.setAvailability(0, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Mar.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[1].allDay)}
                  onValueChange={(value) => this.setAvailability(1, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[1].morning)}
                  onValueChange={(value) => this.setAvailability(1, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[1].evening)}
                  onValueChange={(value) => this.setAvailability(1, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[1].night)}
                  onValueChange={(value) => this.setAvailability(1, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Mie.</Text>
              <View style={{ marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[2].allDay)}
                  onValueChange={(value) => this.setAvailability(2, 'allDay', value)}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[2].morning)}
                  onValueChange={(value) => this.setAvailability(2, 'morning', value)}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[2].evening)}
                  onValueChange={(value) => this.setAvailability(2, 'evening', value)}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[2].night)}
                  onValueChange={(value) => this.setAvailability(2, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Jue.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[3].allDay)}
                  onValueChange={(value) => this.setAvailability(3, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[3].morning)}
                  onValueChange={(value) => this.setAvailability(3, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[3].evening)}
                  onValueChange={(value) => this.setAvailability(3, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[3].night)}
                  onValueChange={(value) => this.setAvailability(3, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Vie.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[4].allDay)}
                  onValueChange={(value) => this.setAvailability(4, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[4].morning)}
                  onValueChange={(value) => this.setAvailability(4, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[4].evening)}
                  onValueChange={(value) => this.setAvailability(4, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[4].night)}
                  onValueChange={(value) => this.setAvailability(4, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Sab.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[5].allDay)}
                  onValueChange={(value) => this.setAvailability(5, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[5].morning)}
                  onValueChange={(value) => this.setAvailability(5, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[5].evening)}
                  onValueChange={(value) => this.setAvailability(5, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[5].night)}
                  onValueChange={(value) => this.setAvailability(5, 'night', value)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text>Dom.</Text>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[6].allDay)}
                  onValueChange={(value) => this.setAvailability(6, 'allDay', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[6].morning)}
                  onValueChange={(value) => this.setAvailability(6, 'morning', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[6].evening)}
                  onValueChange={(value) => this.setAvailability(6, 'evening', value)}
                />
              </View>
              <View style={{marginTop: 10 }}>
                <Switch
                  onTintColor={Colors.primary}
                  value={Boolean(availability[6].night)}
                  onValueChange={(value) => this.setAvailability(6, 'night', value)}
                />
              </View>
            </View>
          </View>
          <View style={[styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
            <TouchableItem
              pointerEvents="box-only"
              accessibilityComponentType="button"
              accessibilityTraits="button"
              testID="profile-available"
              delayPressIn={0}
              style={Styles.btnSave}
              onPress={() => onSuccess(availability)}
              pressColor={Colors.primary}
            >
              <View pointerEvents="box-only">
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>GUARDAR</Text>
              </View>
            </TouchableItem>
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
