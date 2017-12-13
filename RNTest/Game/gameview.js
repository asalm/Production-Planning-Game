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
      running: true,
    }
    //The Socket kind of doesnt care for the Timer being set to 2seconds and throws
    //a warning. We use this to suppress the Warning, since everything else is working.
    console.disableYellowBox = true;
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
      this.socket.emit('checkin', {name: "machine1"});
    });
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
  componentWillUnmount(){
  }
  workloadAnswers = (dataFromChild) => {
    if(!dataFromChild.time){
    	this.socket.emit('status',{machine: dataFromChild.name, status:1,time:''});
    }else{
      this.socket.emit('status', {machine: dataFromChild.name, status: 0,time: dataFromChild.time});
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
    this.socket.on('workload', function(data){
    	if(data.machine === global.name)
    	 this.refs.wl.produce(data.type,data.amount);
    })
  }
  //Sets the initial state of the machines
  constructGlobalMachineState(){
    global.workingState = {machine1: 0, machine2: 0, machine3: 0, machine4: 0, machine5: 0};
  }

  howDoICallThisMethod(){
    if(this.state.running = false){
      return(
          <View>
            <Text style={ppstyle.productionText}>Waiting for Game to start</Text>
          </View>
        );
    }else if(this.state.running = true){
      return (
      <View>{/* style={ppstyle.contentbox}>*/}

      <GameState/>
      {/*Application View goes here-->*/}
      <WorkLoad ref="wl" callbackParent={this.workloadAnswers}/>
    </View>

    );
    }
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
          <Text style={ppstyle.productionText}>Waiting for Game to Start</Text>
        )}
        <TouchableOpacity 
          style={ppstyle.touchable}  
          onPress={this.endEverything}>
          <Text style={ppstyle.touchableText}>BYE!</Text>
        </TouchableOpacity>

      </View>  
		);
  }
}
export {GameView};