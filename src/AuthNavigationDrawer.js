import React, { Component } from 'react';
import { Image } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import Routes from './constants/routes';
import DrawerContent from './components/DrawerContent';
import DrawerItem from './components/DrawerItem';

import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home/Home';
import WelcomeScreen from './screens/Home/Welcome';
import ProfileScreen from './screens/Profile';
import MatchScreen from './screens/Match';
import PlayScreen from './screens/Play';
import PlayMatchScreen from './screens/Play/PlayMatch';
import MatchHistoryScreen from './screens/MatchHistory';
import MatchDetailScreen from './screens/MatchDetail';
import MyCalificationsScreen from './screens/MyCalifications';
import MyCalificationsDetailsScreen from './screens/MyCalifications/details';
import FeedbackScreen from './screens/Feedback';
import SuggestedPlayersScreen from './screens/SuggestedPlayers';
import ViewPlayerScreen from './screens/Profile/infoPlayer';

import SearchUsersScreen from './screens/Searchs/Users';
import NewsDetailScreen from './screens/News/Details'

const AuthNavigationDrawer = lang => DrawerNavigator({
  Login: {
    screen: LoginScreen,
  },
  Welcome: {
    screen: WelcomeScreen,
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Home"
          icon={<Image source={require('./assets/home.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/home.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mi Perfil"
          icon={<Image source={require('./assets/profile-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/profile-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Match: {
    screen: MatchScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Crear Partido"
          icon={<Image source={require('./assets/CrearPartido.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/CrearPartido.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Play: {
    screen: PlayScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Quiero Jugar"
          icon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  PlayMatch: {
    screen: PlayMatchScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Detalle del Partido"
          icon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MatchHistory: {
    screen: MatchHistoryScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Partidos"
          icon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MatchDetail: {
    screen: MatchDetailScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Partidos"
          icon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MyCalifications: {
    screen: MyCalificationsScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Calificaciones"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MyCalificationsDetails: {
    screen: MyCalificationsDetailsScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Calificaciones"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Feedback: {
    screen: FeedbackScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Feedback"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  SuggestedPlayers: {
    screen: SuggestedPlayersScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Queres invitar a alguien?"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  ViewPlayer: {
    screen: ViewPlayerScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Información del Jugador"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  //
  SearchUsers: {
    screen: SearchUsersScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Buscar Jugadores"
          icon={<Image source={require('./assets/BuscarJugadores.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/BuscarJugadores.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  NewsDetail: {
    screen: NewsDetailScreen,
  },
}, {
  initialRouteName: 'Login',
  contentComponent: DrawerContent,
  contentOptions: {
    items: Routes.isAuthRoutes,
    activeTintColor: '#3F78C3',
  },
});

export default AuthNavigationDrawer;
