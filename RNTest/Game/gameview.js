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
var baseUrl = 'http://172.104.229.28:8000'
const PRIVATE_CHANNEL = 'ppc-game-communication-broadcast';

class GameView extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            running: false,
        }
    //The Socket kind of doesnt care for the Timer being set to 2seconds and throws
    //a warning. We use this to suppress the Warning, since everything else is working.
    console.disableYellowBox = true;

    this.socket = SocketIOClient(baseUrl, {transports: ['websocket'], timeout: 2000});
    console.log('SocketIO: Creating Websocket Connection on: ' + baseUrl);
    }
  componentWillMount(){
    global.gamemode = "KANBAN";
  }
  componentDidMount(){
    //Waiting for something to happen:
    /*
    this.socket.on('startgame', function(data){
      global.gamemode = data.gametype;
      this.constructGlobalMachineState()
      this.startListeners();

    });

    */
    this.constructGlobalMachineState()
    this.startListeners();
  }

  workloadAnswers = (dataFromChild) => {
    if(dataFromChild.activity === 'start'){
  	this.socket.emit('start',{machine: dataFromChild.name});
    }else if(dataFromChild.activity === 'finish'){
      this.socket.emit('finish', {time: dataFromChild.time});
    }
  }


  startListeners(){
    this.socket.on('connect', () => {

      console.log('SocketIO: Connection to Server established');
      this.socket.emit('subscribe-to-channel', {channel: PRIVATE_CHANNEL});
      //console.log(this.socket.id)

      this.socket.on('messages.new', (data) => {
        console.log('EVENT:', data.status)
      });
    });

    this.pings = setInterval(() => {
    //console.log('SocketIO: send ping');
    this.socket.emit('whoworkin');
  },1000);
    this.socket.on('theyworkin', function(data){
    	global.workingState.machine1 = data.number1;
    	global.workingState.machine2 = data.number2;
    	global.workingState.machine3 = data.number3;
    	global.workingState.machine4 = data.number4;
    	global.workingState.machine5 = data.number5;
    	//console.log('SocketIO: ' + data.number1 + ";" + data.number2 + ";" + data.number3);
    });

    this.socket.on('workload', function(data){
    	if(data.machine === global.name)
    	this.refs.wl.produce(data.type,data.amount);
    })
  }
  constructGlobalMachineState(){
    global.workingState = {machine1: 0, machine2: 0, machine3: 0, machine4: 0, machine5: 0};
  }
  	render(){
		return(
		<View>{/* style={ppstyle.contentbox}>*/}

			<GameState/>
			{/*Application View goes here-->*/}
			<WorkLoad ref="wl" callbackParent={this.workloadAnswers}/>
		</View>

		);
  	}
}

export {GameView};

