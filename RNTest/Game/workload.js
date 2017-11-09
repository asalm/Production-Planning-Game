/*workload.js*/

import React, { Component } from 'react';
import {
  Platform,
  Text,
  View
} from 'react-native';
import {ppstyle} from '../style.js';
class WorkLoad extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            timer: 0,
            units: 0,
            active: false,
        }
    }
  
  	render(){
		return(
		<View  style={ppstyle.contentWorkOrder}>
			<Text>Countdown - Units to Produce</Text>{/*Application View goes here-->*/}
		</View>

		);
  	}
}

export {WorkLoad};