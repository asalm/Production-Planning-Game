import React, { Component } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import "../UserAgent";
//Importing Sub-Modules
import {ppstyle} from '../style.js';
import {GameState} from './gamestate.js';
import {WorkLoad} from './workload.js';
import SocketIOClient from 'socket.io-client';
import renderIf from '../renderIf.js';

var baseUrl = 'http://172.104.229.28:8000'
const PRIVATE_CHANNEL = 'ppc-game-communication-broadcast';

class GameView extends Component {

	constructor(props) {
    super(props);
    this.state = {
      running: false
    }
    //The Socket kind of doesnt care for the Timer being set to 2seconds and throws
    //a warning. We use this to suppress the Warning, since everything else is working.
    console.disableYellowBox = true;
    //Set up Global for Time and Produced Amount for Time per production
    global.time = 0;
    global.amount = 0;
    //Create SocketInstance with BaseURL, defined Transport and Timeout.
    this.socket = SocketIOClient(baseUrl, {transports: ['websocket'], timeout: 2000});
    console.log('SocketIO: Creating Websocket Connection on: ' + baseUrl);
  }
  componentWillMount(){
  }
  componentDidMount(){
    this.socket.on('connect', () => {
      console.log('SocketIO: Connection to Server established');
      this.socket.emit('subscribe-to-channel', {channel: PRIVATE_CHANNEL});
    });
    //Waiting for something to happen:
    /*

    */
    this.constructGlobalMachineState()
    this.startListeners();
    //this.refs.wl.preproduce('C0',8);
  }
  componentWillUnmount(){
  }
  //dataFromChild.id => Type of workloadAnswer (status, preproductionFin,)
  //dataFromChild.time => How much dime it took the machine to create given Workorder
  //dataFromChild.status => Answer if the Machine is currently working or not.
  workloadAnswers = (dataFromChild) => {
    /*
    if(!dataFromChild.time){
    	this.socket.emit('status',{machine: dataFromChild.name, status:1,time:''});
    }else{
      this.socket.emit('status', {machine: dataFromChild.name, status: 0,time: dataFromChild.time});
    }
    */
    if(dataFromChild.id === "preproductionFin"){
      //this.socket.emit('finishedpreproduction', machine: global.name);
      this.socket.emit('finPreProd', {name: global.name});
      this.setState({running:false});

    }
  }

  endEverything = () => {
    this.socket.emit('checkout', {name: "machine1"});
    this.socket.disconnect();
  }
  //This function initialises the responsive Listeners and starts the Timer for
  //a ping event to retrieve machine-status every second.
  startListeners(){
    //Only one Machine, in our Case Machine 1 has to keep the emits, otherwise this will cause
    //unnessessary Traffic since 5 people are asking for the same broadcast at nearly the same time
    if(global.name === "machine1"){
      this.pings = setInterval(() => {
        this.socket.emit('whoworkin');
      },1000);
    }
    this.socket.on('messages.getStatus', function(data){
    	global.workingState.machine1 = data.status.number1;
    	global.workingState.machine2 = data.status.number2;
    	global.workingState.machine3 = data.status.number3;
    	global.workingState.machine4 = data.status.number4;
    	global.workingState.machine5 = data.status.number5;
      console.log('App: ' + data.status);
    }); 
    this.socket.on('gamefinish', function(data){
      var tpp = global.amount / global.time;
      this.socket.emit('tpp', tpp);
    });
    this.socket.on('preproduce', (data) => {
      console.log("App: preproduction Order: " + data.machine +";"+data.type+";"+data.amount);
      if(data.machine === global.name){
        this.setState({running:true});
        this.refs.wl.preproduce(data.type, data.amount);
      }
    });
    this.socket.on('ready', function(data){
      global.gamemode = data.gametype;
      this.setState({running: true});
    });
    this.socket.on('workload', function(data){
      if(this.state.running){
    	 if(data.machine === global.name){
    	   this.refs.wl.produce(data.type,data.amount);
       }
      }
    });
    this.socket.on('reset', () => {
      this.setState({running:false});
      global.time = 0;
      global.amount = 0;
    });
  }
  //Sets the initial state of the machines
  constructGlobalMachineState(){
    global.workingState = {machine1: 0, machine2: 0, machine3: 0, machine4: 0, machine5: 0};
  }

  render(){
		return(
      <View>
        {renderIf(this.state.running,
          <GameState/>
        )}
        {renderIf(this.state.running,
          <WorkLoad ref="wl" callbackParent={this.workloadAnswers}/>)}
        {renderIf(!this.state.running,
          <Text style={ppstyle.waitingText}>Waiting for Game to Start</Text>
        )}
        {/*
        <TouchableOpacity 
          style={ppstyle.touchable}  
          onPress={this.endEverything}>
          <Text style={ppstyle.touchableText}>BYE!</Text>
        </TouchableOpacity>
        */}
      </View>  
		);
  }
}
export {GameView};