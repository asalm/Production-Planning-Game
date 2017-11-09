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
  
  	render(){
		return(
		<View style={ppstyle.contentTop}>
      
			{/*Representation of the single Mashines*/}
      <MashineComponent/>
      <MashineComponent/>

      <MashineComponent/>

      <MashineComponent/>

      <MashineComponent/>

		</View>

		);
  	}
}

export {GameState};