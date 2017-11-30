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

//Data Handlers
import Pusher from 'pusher-js/react-native';
//import SocketIOClient from 'socket.io-client/socket.io';

// Helpers and own components
import * as Helpers from './helpers/Helpers.js';
import {ppstyle} from './style.js';
const authEndpointRoute = "http://adrien.wtf/oauth/token";
class PusherService extends Component {
  constructor(props) {
    super(props);
    	var socket;
      var channel;
      var pchannel;
      var userId = 1;
      var response = '';
    	this.state = {
        servermessage: 'no message arrived',
        pChannelStatus: false,
        active: false,
        loggedIn: false,
        CSRFToken : '',
        conn_type: 'socketio',
      }

      
    }

//------------------------
// IMPORTANT NOTE
//------------------------
//Before connecting to Pusher, request the authentification with
//fetch: https://facebook.github.io/react-native/docs/network.html
//afterwards store the AuthToken as a Prop or something to hand it to
//the components
    async LogInToServer(){
      console.log('App: Access token is ' + global.access_token);
      if(global.access_token !== null){
        this.setState({CSRFToken : global.access_token});
      }
      /*
      try{
      let sToken = await fetch(authEndpointRoute, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 2,
          client_secret: 'wY0NIjiEHQNz51IVOxaTwr4cfDmgotLheX80bGX2',
          grant_type: 'password',
          username: 'machine1',
          password: 'secret',
          scope: '*'
        })
      })
      var answer = await sToken.json();
      console.warn(JSON.stringify(answer.access_token));
      this.setState({CSRFToken: JSON.stringify(answer.access_token)});
      //return response;//this.response = await sToken.json();
      } catch( error ){
        console.error(error);
      }
      */
      setTimeout(() => {
        this.createSocket();
        },2000);
      if(this.state.conn_type === 'pusher'){
      setTimeout(() => {
        this.openPublicChannel();
        //
      }, 4000);
      setTimeout(() => {
        this.openPrivateChannel();
      }, 6000);
    }
    }

    createSocket() {
      let conn_type = this.state.conn_type;
      console.log('App: trying to connect with ' + conn_type + ' as socket.')
      if(conn_type === 'pusher'){
        try{
          console.log('App: creating socket, CSRFToken is: ' + this.state.CSRFToken);
          Pusher.logToConsole = true;
          this.socket = new Pusher('bd49390d7cfc438fb299',{
            cluster: 'eu',
            authEndpoint: 'http://adrien.wtf/pusher/api',
            auth: {
              headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer: ' + this.state.CSRFToken
              },
            },
            appid: "423392",
            key: "bd49390d7cfc438fb299",
            secret: "41e6d5fb6d7215e5ebc7",
            encrypted: true,
            activityTimeout: 3000
          });
          //this.socket.activityTimeout(3000);
          var pusherID = this.socket.socket_id;
          ToastAndroid.show('connected with id: ' + pusherID, ToastAndroid.SHORT);
        } catch(error) {
          console.log('App: Error establishing Socket with Pusher.js, falling back to socket.io');
          this.setState({conn_type: 'socketio'});
          this.createSocket();
        }
      } else if(conn_type === 'socketio'){
        try{
          console.log('App: Creating Socket ...');
          //this.socket = io.connect('http://adrien.wtf/socketio',{transports: ['websocket']});
          //console.log('App: Creation succeeded; Socket established with: ' +  this.socket.id)
          //const SocketIOClient = require('socket.io-client');
          /*
          this.socket = SocketIOClient('http://172.104.229.28:8000', {
            transports: ['websocket'], 
            path: '/socketio'
          });*/
          //var ws = new WebSocket('ws://adrien.wtf:8000/socket.io/?transport=websocket');
          //ws.onopen = () => {
          // connection opened
          //ws.send('something'); // send a message
          //};
          /*
          ws.onmessage = (e) => {
          // a message was received
          console.log(e.data);
          };

          ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
          };*/
          
          //this.socket.join('ppc-game-communication-broadcast');
          //this.socket.emit('message.new', 'Germans love Human Meat');
          console.log('Socked is connected' + this.socket.connected);
          this.socket.on('ppc-game-communication-broadcast:message.new', (data) => {
            console.log('App: Connection established with socketio.');
            this.setState({servermessage: data})
          });
          /*
          (data) => {
            console.log('App: Recieved Server Data with ' + JSON.stringify(data));
          //});
          this.socket.on('connection', () => {
            //this.setState({servermessage: data});
            console.log('App: Connection established with socketio.');
            //console.log('App: SocketID is ' + this.socket.id);
          }) */
        } catch(err){
          console.log('App: Error establishing Socket with socket.io, App will not work without a proper socket');
          console.log('App: Just give the students who did this 21 ECTS');
          console.log(err.name + ';' + err.message);
        }
      }
      //For Server Check - DELETE ON RELEASE 
      
      /*
      if(this.socket !== null){
      var pusherID = this.socket.connection.socket_id;
      ToastAndroid.show('connected with id: ' + pusherID, ToastAndroid.LONG);
      console.warn(pusherID);
      }
      */
      //Pusher.channel_auth_endpoint = 'http://ppc-game.fhstp.ac.at/pusher/api';
      //this.openPublicChannel();
      //this.openPrivateChannel();
    }

    openPublicChannel() {
      this.channel = this.socket.subscribe('my-channel');
      this.channel.bind('my-event', (data) => {
        this.setState({active: true})
        this.serverAnswer(data, 'public');
      });
      this.channel.bind('pusher:subscription_succeeded', (data) => {
        console.log('App: connection with public channel established');
      });

    }

    openPrivateChannel() {
      console.log('App: Attempting to join a private channel');
      this.pchannel = this.socket.subscribe('private-my-channel');
      this.pchannel.bind('private-my-event', (data) => {
        this.serverAnswer(data, 'private');
      });
      
      this.pchannel.bind('pusher:subscription_succeeded', () => {
        console.log('App: connection with privateChannel established');
        //this.setState({pChannelStatus: true});
        //var pusherID = this.socket.connection.socket_id;
        //ToastAndroid.show('connected with id: ' + pusherID, ToastAndroid.SHORT);
      });
      this.pchannel.bind('pusher:subscription_error', () => {
        console.log('App: connection with privateServer failed');
        this.channel.unsubscribe();
        this.socket = null
        console.log('App: Establishing a private Channel failed. Falling back to socket.io');
        //console.log('App: Connection with public Channel established. cannot send events right now')
        this.setState({conn_type: 'socketio'});
        this.createSocket();
      });

      this.pchannel.bind('pusher:subscription_failed', function() {
        ToastAndroid.show('Failed to subscribe to channel', ToastAndroid.SHORT);
        serverAnswer('Failed to subscribe','private');
      });
    }

    //For Clients to trigger events on the server, it needs to be send to a private channel
    //Private Channels only work with authenticated clients
    sendAnswer = () => {
      let logged = this.state.loggedIn;
      if(logged){
        this.pchannel = this.socket.subscribe('private-my-channel');
        var triggered = this.pchannel.trigger('client-private-my-event', {"answer":"im new here"});
      } else {
        ToastAndroid.show('client not logged in', ToastAndroid.SHORT);
      }
    }

    serverAnswer(serverMessage, type) {
      var answer = JSON.stringify(serverMessage.message);
      var type = type;
      switch(type) {
        case 'public':
          this.setState({servermessage: 'public' + answer});
          break;
        case 'private':
          this.setState({servermessage: 'private' + answer});
      }
    }
    //Lifecycle Functions
    componentWillUnmount(){
      //this.props.channel.unbind('my-event');
      //pchannel.unbind('private-my-event');
      this.setState({active: false});
    }
    componentDidMount(){
      this.LogInToServer();
    }

    render() {
      let {servermessage, pChannelStatus} = this.state
        return (
        <View style={ppstyle.container}>
        	<Text style={ppstyle.basic}>{servermessage}</Text>
          <Text style={ppstyle.basic}>Channelstatus {pChannelStatus}</Text>
          <Button
            onPress={this.sendAnswer}
            color='#ff33ff'
            title='answer to server'
            />
        </View>
        );
    }
}

export {PusherService};