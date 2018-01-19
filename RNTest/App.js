//landing.js

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
import NfcManager, {NdefParser} from 'react-native-nfc-manager';
import {StackNavigator} from 'react-navigation';
//Own Components

import {ppstyle} from './style.js';
//Testing Purpose
import {GameView} from './Game/gameview.js';
//import {LoginComponent} from './Game/loginComponent.js'

class Landing extends React.Component {
	static navigationOptions = {
		header: null		
	};
		constructor(props){
		super(props);

		this.state = {
			username: '',
			password: '',
		}
	}

	_onLoginPress(){
		let {username, password} = this.state;
		if(username !== '' && password !== ''){
			console.log('App: logging in with ' + username + ';' + password);
			this.fetchAndVerify();
		}else if(username === '' || password === ''){
			Alert.alert('It seems you may have either forgot to insert a Username or Password');
			if(username === ''){
				this.refs.usernameInput.focus();
			}else if(password === ''){
				this.refs.passInput.focus();
			}
		}
	}

	openHowTo = () => {
		ToastAndroid.show('Head to http://www.ppg-game.fhstp.ac.at for further instructions.',ToastAndroid.SHORT);
	}

	async fetchAndVerify(){
		let {navigate} = this.props.navigation;
		try{
      		let sToken = await fetch("http://adrien.wtf/oauth/token", {
		        method: 'POST',
		        headers: {
		          'Accept': 'application/json',
		          'Content-Type': 'application/json',
		        },
		        body: JSON.stringify({
		          client_id: 2,
		          client_secret: 'uNH9J0b4Ga2kfsXdDM6i774v1LKZXul2J3P5iyNv',
		          grant_type: 'password',
		          username: this.state.username,
		          password: this.state.password,
		          scope: '*'
		        })
		      })
	        var answer = await sToken.json();
	        console.log('App: Server answered with ' + JSON.stringify(answer));
	        if(answer.access_token  != null){
	      		console.log('App: Login Successful with ' + this.state.username + ";" + this.state.password);
	      		global.access_token = answer.access_token;
	      		global.name = this.state.username
	      		//pass access_token to global vars
	      		this.refs.passInput.blur()

	      		navigate('PlayGame');
	      		//navigate('Socket');
	        }else{
	      		Alert.alert('You may have input the wrong Username/Password combination');
	      		this.refs.usernameInput.clear();
	      		this.refs.passInput.clear();
	      		this.refs.usernameInput.focus();
	      	}
      //console.warn(JSON.stringify(answer));
      //this.setState({CSRFToken: JSON.stringify(answer.access_token)});
      //return response;//this.response = await sToken.json();
      } catch( error ){
      	Alert.alert('It seems the Server is temporarily offline. Please try again later. If the Error persists, you may want to contact IT&I for further information');
        //console.error(error);
      }
	}
	
	//TouchableOpacity
	//At the bottom: Info + Credits

	render() {
		let {username, password} = this.state;
		return(
		<View style={{flex:1}}>
		<View style={ppstyle.container}>
			<View style={ppstyle.containerRow}>
			<Image 
				source={require('./img/logo.png')}
				style={{width:45, height:45}}/>
				<Text style={ppstyle.titleText}>Production Planning Game</Text>
			</View>
			<View style={{marginTop: 40}}>
				<TextInput
					style={{width:300}}
					ref='usernameInput'
					autoCorrect={false}
					caretHidden={true}
					returnKeyType={'next'}
					onChangeText={(text) => {
						this.setState({username: text})
					}}
					placeholder='username'
					onSubmitEditing={() => {
						this.refs.passInput.focus();
					}}
				/>
				<TextInput
					style={{width:300}}
					ref='passInput'
					autoCorrect={false}
					returnKeyType={'done'}
					secureTextEntry={true}
					onChangeText={(text) => this.setState({password: text})}
					placeholder='password'
				/>
			</View>
			<TouchableOpacity 
				style={ppstyle.touchable}  
				onPress={() => this._onLoginPress()}>
					<Text style={ppstyle.touchableText}>Log In</Text>
	        </TouchableOpacity>

	       

        </View>
         <View style={ppstyle.footer}>
	        	<Text style={ppstyle.footerText}>v1.02 - European Project Semester 2017/2018</Text>
	        	<TouchableOpacity
	        		style={{top:10,left:670}}
	        		onPress={() => this.openHowTo()}>
	        		<Text style={ppstyle.footerHowTo}>How to Play?</Text>
	        	</TouchableOpacity>
	        </View>
	    </View>
	    );
	}
}

//This is a reference of what to render as a GameView (we can pass the CSRF-Token retrieved on Login here)
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

//This will be exported and exposed to the ReactComponent Handler as the MainView
export const PPG = StackNavigator({
  Home: { screen: Landing},
  PlayGame: {screen: Game},
},{headerMode: 'none'});

//This will bundle the Navigator and therefor present the App to the User

export default class App extends React.Component {
  render() {
    return <PPG />;
  }
}