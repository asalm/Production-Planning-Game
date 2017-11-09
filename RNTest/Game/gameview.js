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

//Importing Sub-Modules
import {ppstyle} from '../style.js';
import {GameState} from './gamestate.js';
import {WorkLoad} from './workload.js';

class GameView extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            running: false,
        }
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

