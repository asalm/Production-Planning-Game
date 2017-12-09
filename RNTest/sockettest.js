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


//FH only can use 80 and 443
var baseUrl = 'http://172.104.229.28:8000';
var url = "ws://demos.kaazing.com/echo";
const PRIVATE_CHANNEL = 'ppc-game-communication-broadcast';


class SocketService extends Component {
  constructor(props) {
    super(props);
    var pings;
    this.state = {
      active: true
    }
    //Required so react knows its working in an App and not on the web
    window.navigator.userAgent = 'react-native';

    this.socket = SocketIOClient(baseUrl, {transports: ['websocket'], timeout: 16000});
    console.log('SocketIO: Creating Websocket Connection on: ' + baseUrl);
    console.log('SocketIO: Times out after : ' + this.socket.timeout);
    
 }

componentWillMount(){
	//this.socket.connect();
	//this.socket.
	console.log('SocketIO: Component did mount!');
	
}
componentWillUnmount(){
  clearInterval(this.pings);
	this.socket.disconnect();
}
componentDidMount(){
  this.socket.on('connect', () => {
      console.log('SocketIO: Connection to Server established');
      this.socket.emit('subscribe-to-channel', {channel: PRIVATE_CHANNEL});
      console.log(this.socket.id)

      socket.on('event', (data) => {
        console.log('EVENT', data)
    })

    socket.on('messages.new', (data) => {
        console.log('NEW PRIVATE MESSAGE', data)
    })
    this.pings = setInterval(() => {
    console.log('SocketIO: send ping');
    this.socket.emit('ping');}
  ,1000);
  this.socket.on('pong', () => console.log('SocketIO: pong'));
    });

  
  this.socket.on('connect_timeout', () => {
    console.log('SocketIO: Connection timed out');
    this.socket.close();
    this.socket.open();
    clearInterval(this.pings);
    this.setState({active: false});
  })
  
    
    //To filter connect_error messages after socket timed out.
    if(this.state.active === true){
    this.socket.on('connect_error', (error) => {
      console.log('SocketIO: ' + error);
    });
    }

    this.socket.on('disconnect', () => {
      console.log('SocketIO: Connection disbanded');
    });
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