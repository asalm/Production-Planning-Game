/**
 * Extended Test App for Production Planning Game
 * Includes nfc-manager by:whitedogg13 (https://github.com/whitedogg13/react-native-nfc-manager)
 * Includes pusher by: ---()
 * Includes StackNavigator by React
 * 
 */

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
import {ppgstyle} from './style.js';


/*
class NFCReader extends React.Component{
  render(){
    return(
      <NFCReader/>
      );
  }
};
*/
const nav = StackNavigator({
    NFCReader: {screen:NFCReader},
});
//componentDidMount() -> will be called after the UI finished loading, we can do nfc functionality check here
//Controller for when the Button in the UI is pressed
const PressNotification = () => {
  if (Platform.OS === 'android'){
    //Check weather NFC is enabled, if not redirect user to NFC Setting

    NfcManager.isEnabled().then(enabled => {
      if(enabled){
        ToastAndroid.show("NFC enabled", ToastAndroid.LONG);
        //Procede here to activate Event Handler and shit
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
  
    /*
    if(NfcManager.isEnabled()){
      console.warn('NFC Status: ' + Object.getOwnPropertyNames(NfcManager.isEnabled()));
      ToastAndroid.show("NFC enabled",ToastAndroid.LONG);
    }else if(!NfcManager.isEnabled()){
      ToastAndroid.show("NFC not enabled!",ToastAndroid.LONG);
      
    }
    */
  } else if(Platform.OS === 'ios'){
    Alert.alert('Button has been pressed!');
  }
};

const _goToSettings =  () => {
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

  const {navigate} = this.props.navigation;

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={ppgstyle.important}>
          {welcomeText}
        </Text>        
        <Text style={ppgstyle.basic}>
          {instructions}
        </Text>
        {/*Username Input*/}
        <BasicTextInput
        />  
      {/*Password Input*/}
        <BasicTextInput
        />

        <Button
          onPress={PressNotification}
          title="Start NFC Listener"
          color="#333333"
          />

        <Button
          onPress={_goToSettings}
          title="NFC Settings"
          color="#333333"
          />
        <Button
          onPress={() => navigate('NFCReader')}
          title="Go To NFC Reader"
          color="#444444"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
