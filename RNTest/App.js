//Navigator by https://reactnavigation.org/

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  Alert,
  ToastAndroid,
  View
} from 'react-native';
import NfcManager, {NdefParser} from 'react-native-nfc-manager';
import {StackNavigator} from 'react-navigation';
//Own Components
import {BasicTextInput} from './BasicTextInput.js';
import {NFCReader} from './nfc.js';
import {ppstyle} from './style.js';
import {PusherService} from './pusherservice.js';
import {GameView} from './Game/gameview.js';

const instructions = Platform.select({
  		ios: 'Press Cmd+R to reload,\n' +
    		 'Cmd+D or shake for dev menu',
    	android: 'Double tap R on your keyboard to reload,\n' +
    		 'Shake or press menu button for dev menu',
	});

	const welcomeText = Platform.select({
  		ios: 'React Native Test \n' +
  			 'Production Planning Games',
  		android: 'React Native Test \n' +
  			 'Production Planning Games',
	});
	const username = Platform.select({
  		ios: 'username',
  		android: 'username',
	});
	const password = Platform.select({
		ios: 'username',
		android: 'username',
	});

class Game extends React.Component{
  static naviagionOptions = {
    header: null
  };
  render(){
    return(
    <GameView>
    </GameView>
      );
  }
}

class HomeScreen extends React.Component{
	static navigationOptions = {
		header: null
	};
	PressNotification(){
  		if (Platform.OS === 'android'){
    	//Check weather NFC is enabled, if not redirect user to NFC Setting

    	NfcManager.isEnabled().then(enabled => {
       		if(enabled){
        		ToastAndroid.show("NFC enabled", ToastAndroid.LONG);
      		}else{
        		Alert.alert(
          			'NFC deactivated',
          			'You need to activate NFC for this Application to work',
          			[
			           {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			           {text: 'OK', onPress: () => NfcManager.goToNfcSetting()},
			        ],
          			{ cancelable: false }
          		)
      		}
   		})
  		} else if(Platform.OS === 'ios'){
   			Alert.alert('Button has been pressed!');
  		}
	};

	goToSettings() {
        if (Platform.OS === 'android') {
            NfcManager.goToNfcSetting()
                .then(result => {
                    console.log('goToNfcSetting OK', result)
                })
                .catch(error => {
                    console.warn('goToNfcSetting fail', error)
                })
        }
	};

	render() {
		const { navigate } = this.props.navigation;
		return (
      <View style={ppstyle.container}>
        <Text style={ppstyle.important}>
          {welcomeText}
        </Text>        
        <Text style={ppstyle.basic}>
          {instructions}
        </Text>
        {/*Username Input*/}
        <BasicTextInput
        />  
      {/*Password Input*/}
        <BasicTextInput
        />

        <Button
          onPress={this.PressNotification}
          title="Start NFC Listener"
          color="#333333"
          />

        <Button
          onPress={this.goToSettings}
          title="NFC Settings"
          color="#333333"
          />
        <Button
          onPress={() => navigate('Reader')}
          title="Go To NFC Reader"
          color="#444444"
          />
        <Button
          onPress={() => navigate('PushService')}
          title='Test Pusher'
          color='#123BBB'
          />

        <Button 
          onPress={() => navigate('PlayGame')}
          title='GameScene Test'
          color='#12FF44'
          />
      </View>
    );
	}
}

class PushingTest extends React.Component{
  static navigationOptions = {
    title: 'Pusher Service Test',
  };
  render(){
    return(
    <PusherService/>
    );
  }
};

class NFCScreen extends React.Component{
	static navigationOptions = {
		title: 'NFC Reader',
	};
    render(){
	    return(
	      <NFCReader/>
	    );
	}
};

export const PPG = StackNavigator({
  Home: { screen: HomeScreen },
  Reader: { screen: NFCScreen },
  PushService : {screen: PushingTest},
  PlayGame: {screen: Game}
});



export default class App extends React.Component {
  render() {
    return <PPG />;
  }
}