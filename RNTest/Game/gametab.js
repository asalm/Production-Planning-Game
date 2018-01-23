import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  Image,
  View
} from 'react-native';
import {GameView} from './gameview.js';
import {Instructions} from './Guides/instruction.js';
import { SafeAreaView, TabNavigator } from 'react-navigation';

const GameTab = ({ navigation }) => (
	 <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>

	 	<GameView></GameView>
	 </SafeAreaView>

	);

GameTab.navigationOptions = {
  tabBarTestIDProps: {
    testID: 'TEST_ID_HOME',
    accessibilityLabel: 'TEST_ID_HOME_ACLBL',
  },
  tabBarLabel: 'Game',
};

const InstructionTab = ({ navigation }) => (
	 <SafeAreaView forceInset={{ horizontal: 'always', top: 'always' }}>
	 	<Instructions></Instructions>
	 </SafeAreaView>	
	 );

InstructionTab.navigationOptions = {
	tabBarLabel: 'Instructions',
};


//This is the thing we export to import somewhere else (App.js)
const GameTabs = TabNavigator(
  {
    Game: {
      screen: GameTab,
      path: '',
    },
    Instructions: {
      screen: InstructionTab,
      path: 'instructions',
    },

  },
  {
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
    },
  }
);

export default GameTabs;