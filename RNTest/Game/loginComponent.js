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
import {ppstyle} from '../style.js';

class LoginComponent extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			username: 'empty',
			password: 'more empty',
		}
	}

	_onLoginPress(){
		let {username, password} = this.state;
		console.warn('logging in with' + username + ';' + password);
	}

	fetchAndVerify(){

	}
	//image
	//Next Text
	//white space
	//Text Input
	//Text Input
	//TouchableOpacity
	//At the bottom: Info + Credits

	render() {
		let {username, password} = this.state;
		return(
		<View>
			<Image 
				source={require('../img/favicon.png')}
				style={{width:45, height:45}}/>
			<Text>Production Planning Game</Text>

			<TextInput
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
				ref='passInput'
				autoCorrect={false}
				returnKeyType={'done'}
				secureTextEntry={true}
				onChangeText={(text) => this.setState({password: text})}
				placeholder='password'
			/>
			<TouchableOpacity 
				style={ppstyle.touchable}  
				onPress={() => this._onLoginPress()}>
					<Text style={ppstyle.touchableText}>LogIn</Text>
	        </TouchableOpacity>
	    </View>
	    );
	}
}

export {LoginComponent};