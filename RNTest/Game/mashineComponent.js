import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

class MashineComponent extends Component {

	constructor(props) {
    	super(props);
     	this.state = {
            running: 0,
            backColor: '#FFFFFF',
        }
        //this.checkForActivity();
    }


    ComponentWillMount(){
    	this.checkForActivity();
    }
    checkForActivity(){
    	switch(this.state.running) {
    		case 0:
    			//Mashine is idle
    			this.setState({backColor: '#696969'});
    			break;
    		case 1:
    			//Mashine waits for NFC input
    			this.setState({backColor: '#FFFF00'});
    			break;
    		case 2:
    			//Mashine is working
    			this.setState({backColor: '#7FFF00'});
    			break;
    		default:
    			this.setState({backColor: '#FFFFFF'})
    			break;
    	}
    }
  
  	render(){
		return(
			<View style={[styles.container, {backgroundColor: this.state.backColor}]}>
				<Text>1212121212121</Text>
			</View>
		);
  	}
}

const styles = StyleSheet.create({
        container: {
        	width:60,
        	marginRight: 10,
        	
        },
        instructions: {
            color: "white"
        }
    });

export {MashineComponent};