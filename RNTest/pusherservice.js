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
import {ppstyle} from './style.js';
import Pusher from 'pusher-js/react-native';

class PusherService extends Component {
  constructor(props) {
    super(props);
    	var socket;
      var channel;
    	this.state = {
        servermessage: 'no message arrived :(',
      }
    }
    /*
    async requestPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
          {
            'title': 'Permit Network access',
            'message': 'yada yada.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show("You can use the ínternet now", ToastAndroid.LONG)
          //return true;
        } else {
          console.log("Camera permission denied")
          //return false;
        }
      } catch (err) {
        console.warn(err)
        return false;
      }
    }
    */
    createSocket() {
      this.socket = new Pusher('bd49390d7cfc438fb299', {
        cluster: 'eu',
        encrypted: true
      });
      //For Server Check - DELETE ON RELEASE
      if(this.socket !== null){
      var pusherID = this.socket.connection.socket_id;
      ToastAndroid.show('connected with id: ' + pusherID, ToastAndroid.LONG)
      console.warn(pusherID);
      }
    }

    openChannel() {
      this.channel = this.socket.subscribe('my-channel');
      this.channel.bind('my-event', function(data) {

        ToastAndroid.show("Server answered", ToastAndroid.LONG);
        this.setState({servermessage: data.message});
      });
    }

    componentDidMount(){

      this.createSocket();
      this.openChannel();
    }

    render() {
      let {servermessage} = this.state
        return (
        <View style={ppstyle.container}>
        	<Text style={ppstyle.basic}>{servermessage}</Text>
        </View>
        );
    }
}

export {PusherService};