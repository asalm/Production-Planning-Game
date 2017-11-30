//socket.ioTest

import React, { Component } from 'react';
import SocketIOClient from 'socket.io-client';
import {
  Platform,
  Text,
  Button,
  Alert,
  ToastAndroid,
  View
} from 'react-native';
import {ppstyle} from './style.js';


class SocketIOTest extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			id: null
		}
	}

	componentDidMount(){

		this.socket = SocketIOClient('url');
		this.socket.on('message', this.recievedMessage)
	}

	recievedMessage = (data) => {
		this.setState(message: data);
	}

	render() {
      let {message} = this.state
        return (
        <View style={ppstyle.container}>
        	<Text style={ppstyle.basic}>{message}</Text>

          <Button
            onPress={this.sendAnswer}
            color='#ff33ff'
            title='answer to server'
            />
        </View>
        );
    }
}

export {SocketIOTest};