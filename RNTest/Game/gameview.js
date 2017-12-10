/*
gameview.js
-- import gamestate.js
-- import workload.js
*/
import React, { Component } from 'react';
import {
  Platform,
  View
} from 'react-native';
import "../UserAgent";
//Importing Sub-Modules
import {ppstyle} from '../style.js';
import {GameState} from './gamestate.js';
import {WorkLoad} from './workload.js';
import SocketIOClient from 'socket.io-client';
//const socket = SocketIOClient('http://localhost:8000');
var baseUrl = 'http://localhost:8000'

class GameView extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            running: false,
        }
    this.socket = SocketIOClient(baseUrl, {transports: ['websocket'], timeout: 16000});
    console.log('SocketIO: Creating Websocket Connection on: ' + baseUrl);
    }
  
  componentDidMount(){
    this.constructGlobalMachineState()
    console.log("App: "+global.workingState.machine1);
    this.startListeners();
    this.socket.emit('im here');
  }

  startListeners(){
    this.socket.on('connect',()=>{
      this.socket.emit('im here');
      console.log('App: Connected');
    });
    console.log("App: Listeners Started");
    this.socket.on('hello', (data) => console.log("App: " +data));

    this.socket.on('successful', (data) =>{
    console.log('App: Connection successful ' + data);
});
  }
  constructGlobalMachineState(){
    global.workingState = {machine1: 0, machine2: 0, machine3: 0, machine4: 0, machine5: 0};
  }
  	render(){
		return(
		<View>{/* style={ppstyle.contentbox}>*/}

			<GameState/>
			{/*Application View goes here-->*/}
			<WorkLoad/>
		</View>

		);
  	}
}

export {GameView};

