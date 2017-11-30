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
            workorder: 0,
        }
    }
  
  componentDidMount(){
    this.refs.m1.setActivityState(2);
    this.refs.m1.setName("machine 1");
    this.refs.m2.setActivityState(1);
    this.refs.m2.setName("machine 2");
    this.refs.m3.setActivityState(1);
    this.refs.m3.setName("machine 3");
    this.refs.m4.setActivityState(2);
    this.refs.m4.setName("machine 4");
    this.refs.m5.setActivityState(0);
    this.refs.m5.setName("machine 5");
  }
  	render(){
		return(
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

		);
  	}
}

export {GameState};