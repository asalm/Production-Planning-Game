import React, { Component } from 'react';
import {
  Platform,
  Text,
  View
} from 'react-native';
import {MashineComponent} from './mashineComponent.js';
import {ppstyle} from '../style.js';

class GameState extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            gamemode: '',
        }
      this.updateScheduler;
    }
  
  componentDidMount(){
    if(global.gamemode != ''){
      this.setState({gamemode: global.gamemode});
      console.log('App: ' + this.gamemode);
    }
    this.refs.m1.setName("machine 1");
    this.refs.m2.setName("machine 2");
    this.refs.m3.setName("machine 3");

    this.refs.m4.setName("machine 4");

    this.refs.m5.setName("machine 5");
    this.updateScheduler = setInterval( () => {
      this.refs.m1.setActivityState(global.workingState.machine1);
      this.refs.m2.setActivityState(global.workingState.machine2);
      this.refs.m3.setActivityState(global.workingState.machine3);
      this.refs.m4.setActivityState(global.workingState.machine4);
      this.refs.m5.setActivityState(global.workingState.machine5);
    }, 1200);
    
  }

  componentWillUnmount(){
    clearInterval(this.updateScheduler)
  }
  	render(){
		return(
      <View>
        <View style={ppstyle.contentTop}>
          <Text style={{marginBottom:60}}>{this.state.gamemode}</Text>
        </View>
		  <View style={ppstyle.contentTop}>
			{/*Representation of the single Mashines*/}
        <MashineComponent
          ref="m1"/>
        <MashineComponent
          ref="m2"/>

        <MashineComponent
          ref="m3"/>

        <MashineComponent
          ref="m4"/>

        <MashineComponent
          ref="m5"/>

		  </View>
    </View>
		);
  	}
}

export {GameState};