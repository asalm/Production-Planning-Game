import React, { Component } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  ToastAndroid,
  View
} from 'react-native';
import "../UserAgent";
//Importing Sub-Modules
import {ppstyle} from '../style.js';
import {GameState} from './gamestate.js';
import {WorkLoad} from './workload.js';
import SocketIOClient from 'socket.io-client';
import renderIf from '../renderIf.js';


//To connect to annother server, just change this IP to the destination you want to reach
var baseUrl = 'http://172.104.229.28:8000'
const PRIVATE_CHANNEL = 'ppc-game-communication-broadcast';

class GameView extends Component {

	constructor(props) {
    super(props);
    this.state = {
      running: false,
      producing: false
    }
    //The Socket kind of doesnt care for the Timer being set to 2seconds and throws
    //a warning. We use this to suppress the Warning, since everything else is working.
    console.disableYellowBox = true;
    //Set up Global for Time and Produced Amount for Time per production
    global.time = 0;
    global.amount = 0;
    this.queue = [];
    this.queuelength;
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
  //dataFromChild.id => Type of workloadAnswer (preproductionFin, productionfinished, prodStart)
  //dataFromChild.time => How much dime it took the machine to create given Workorder
  //dataFromChild.status => Answer if the Machine is currently working or not.
  workloadAnswers = (dataFromChild) => {
    if(dataFromChild.id === "preproductionFin"){
      //this.socket.emit('finishedpreproduction', machine: global.name);
      this.socket.emit('finPreProd', {name: global.name});
      this.setState({running:false});

    }else if(dataFromChild.id == "productFin"){

      this.socket.emit('productionfinished', {machine: global.name, time: dataFromChild.time, product: dataFromChild.product, amount: dataFromChild.amount});  
      if(this.queuelength >= 1){
        console.log('App: First in this.queue is ' + this.queue[0].product + "/" + this.queue[0].amount);
        //var firstInQueue = this.queue.shift();
        //console.log('App: elected first in Queue' + firstInQueue.product + "/" + firstInQueue.amount);
        console.log('App: Queuelength is: ' + this.queuelength + ' // productionstate: ' + this.state.producing);

        try{
          this.refs.wl.produce(this.queue[0].product,this.queue[0].amount);
          this.setState({producing:true});
          this.queue.shift();
        }catch(err){

        }
        this.queuelength--;
      }else{
        this.setState({producing:false});
      }
    }else if(dataFromChild.id === 'prodStart'){
      this.socket.emit('productionStarted',{machine:global.name, product:dataFromChild.product,amount:dataFromChild.amount});
    }
  }

  //This function initialises the responsive Listeners and starts the Timer for
  //a ping event to retrieve machine-status every second.
  startListeners(){
    this.socket.on('running', ()=>{
      this.setState({running:true});
    });
    //Sets the small boxes to specific colors
    this.socket.on('mStatus', function(data){
    	global.workingState.machine1 = data.number1;
    	global.workingState.machine2 = data.number2;
    	global.workingState.machine3 = data.number3;
    	global.workingState.machine4 = data.number4;
    	global.workingState.machine5 = data.number5;
    });
    this.socket.on('gamefinish', function(data){
      var tpp = global.amount / global.time;
      this.socket.emit('tpp', {tppAmount: global.amount,tppTime: global.time,name:global.name});
      try{
      this.refs.wl.reset();
      }catch(err){

      }
      this.setState({running:false});
      global.amount = 0;
      global.time = 0;
    });
    this.socket.on('preproduce', (data) => {
      console.log('App: preproduction Order: ' + data.machine +";"+data.type+";"+data.amount);
      if(data.machine === global.name){
        this.setState({running:true});
        try{
          ToastAndroid.show('Prepare your products now, please!',ToastAndroid.SHORT);
          this.refs.wl.preproduce(data.type, data.amount);
        }catch(err){

        }
      }
    });
    //Gamemode is currently emtpy
    this.socket.on('ready', function(data){
      global.gamemode = data.gametype;
      this.setState({running: true});
    });
    //This causes a production to be started
    this.socket.on('produce', (data)=>{
      if(this.state.running){
    	 if(data.machine === global.name){
        if(!this.state.producing){
          try{
    	      this.refs.wl.produce(data.product,data.amount);
            this.setState({producing:true});
          }catch(err){

          }
          }else{
            this.queue.push({product: data.product,amount: data.amount});
            this.queuelength++;
            ToastAndroid.show('A Workorder was added to the Queue',ToastAndroid.SHORT);
            console.log('App: A Workorder has been added to the queue');
          }
       }
      }
    });

    //Resets all used parameters from gameview.js and workload.js
    this.socket.on('appReset', (data) => {
      this.setState({running:false, producing: false});
      try{
        this.refs.wl.reset();
      }catch(err){

      }
      this.queuelength = 0;
      this.queue = [];
      global.time = 0;
      global.amount = 0;
      global.workingState = {machine1: 0, machine2: 0, machine3: 0, machine4: 0, machine5: 0};
      console.log('App: SERVER RESETTED');

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
      </View>  
		);
  }
}
export {GameView};