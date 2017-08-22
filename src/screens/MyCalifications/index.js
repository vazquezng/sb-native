import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import commonFunc from '@utils/commonFunc';
import API from '@utils/api';

const fontRegular = Platform.OS === 'ios' ? 'Cookie' : 'CookieRegular';
const fontRobotoLight = Platform.OS === 'ios' ? 'OpenSans' : 'RobotoLight';

const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class MyCalificationsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Mis Calificaciones',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
        title={'Vuelos Baratos'}
        truncatedTitle={'vuelos'}
      />
    ),
    headerStyle: {
      backgroundColor: '#3f78c3',
    },
    headerTintColor: 'white',
  });

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: true,
      feedbacks: [],
    };
  }

  componentWillMount() {
    const { user } = this.props;
    fetch(`${API}/feedback/califications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      }
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({ spinnerVisible: false, feedbacks: responseJson.feedbacks });
    })
    .catch(() => {
      this.setState({ spinnerVisible: false });
    });
  }

  renderNotFeedbacks() {
    if (this.state.feedbacks.length === 0) {
      return (
        <Text style={Styles.subTitle}>aún no tienes calificaciones</Text>
      );
    }

    return null;
  }

  renderFeedbacks() {
    const { feedbacks } = this.state;
    if (feedbacks.length > 0) {
      return (
        <View style={Styles.flexColumn}>
          {feedbacks.map((f, k) => {
            return this.renderFeedback(f, k)
          })}
        </View>
      );
    }

    return null;
  }
  renderFeedback(feedback, key) {
    return (
      <View key={key} style={[Styles.flexRow, styles.feedbackContainer]}>
        <View>
          {this.renderImage(feedback)}
        </View>
        <View style={Styles.flexColumn}>
          <View>
            <Text style={{ color: Colors.primary}}>{feedback.name}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: fontRegular, fontSize: 14, color: '#000000' }}>
              {feedback.date}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: fontRegular, fontSize: 14, color: '#000000' }}>
              {feedback.comment}
            </Text>
          </View>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('MyCalificationsDetails', { id_match: feedback.id_match, id_user_from: feedback.id_user_from, id_user_to: feedback.id_user_to })}
          >
            <Image
              source={require('../../assets/play/eye-icon.png')}
              style={{ width: 30, height: 25 }}
            />
          </TouchableItem>
        </View>

      </View>
    );
  }

  renderImage(feedback){
    const imageURI = feedback && feedback.image ? feedback.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 100,
          height: 100,
          borderRadius: 50,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100 }}
      />
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Mis Calificaciones"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.title}>¿Qué opinaron de mí?</Text>
            {this.renderNotFeedbacks()}
            {this.renderFeedbacks()}
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textImage: {
    color: Colors.primary,
    fontSize: 18,
    paddingLeft: 10,
  },
  feedbackContainer: {
    width: Metrics.buttonWidth,
    borderColor: Colors.primary,
    borderWidth: commonFunc.isAndroid ? 0.8 : StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 20,
  },
});


export default MyCalificationsScreen;
