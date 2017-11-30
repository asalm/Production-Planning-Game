import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  Alert,
  ToastAndroid,
  PermissionsAndroid,
  View
} from 'react-native';

//import "./UserAgent";
import SocketIOClient from 'socket.io-client';

var baseUrl = 'http://172.104.229.28:8000';
const PRIVATE_CHANNEL = 'ppc-game-communication-broadcast';


class SocketService extends Component {
  constructor(props) {
    super(props);
    //Required so react knows its working in an App and not on the web
    window.navigator.userAgent = 'react-native';

    this.socket = SocketIOClient(baseUrl, {transports: ['websocket']});
    	//path: '/socketio'
    //});
    this.socket.on('connect', () => {
      console.log('Connection to Server established');
      this.socket.emit('subscribe-to-channel', {channel: PRIVATE_CHANNEL});
    });
 }

componentWillMount(){
	//this.socket.connect();
	//this.socket.
	console.log('Socket did connect, maybe?');
	
}
componentWillUnmount(){
	this.socket.disconnect();
}
componentDidMount(){
	/*
	console.log('');
	console.log('App: SocketComponent Did Mount');
	this.socket.on('connect', (data) => {
		console.log('App: SocketID is: ' + JSON.stringify(data));
	});
	this.socket.emit('connect',{message: 'apples are great'});
	this.socket.on('apple', (data) => {
		console.log(data.message);
	});
	/*
	
	this.socket.on('messages.new', (data) => {
            //console.log('App: Connection established with socketio.');
            console.log(JSON.stringify(data));
          });
	this.socket.on('event', (data) => {
		console.log(data);
	});
	this.socket.on('pong', (latency) => {
		console.log(latency);
	});
	*/
}
sendAnswer = () => {
	this.socket.emit('message.new', 'really', function(answer){
		console.log(answer);
	});
}
closeConnection = () => {
	this.socket.disconnect();
}
    render() {
        return (
        <View>
        	<Text>hehe</Text>
          <Button
            onPress={this.sendAnswer}
            color='#ff33ff'
            title='answer to server'
            />
          <Button
          	onPress={this.closeConnection}
          	color='#ff22ff'
          	title='disconnect'
            />
        </View>
        );
    }
}

export {SocketService};