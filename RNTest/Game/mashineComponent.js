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
            name:'',
            running: 0,
            backColor: '#FFFFFF',
        }
        //this.checkForActivity();
    }

    setName(namestring){
        this.setState({name: namestring});
    }
    //Expects 0, 1 or 2
    setActivityState(activity){
        switch(activity){
            case 0:
                this.setState({backColor: '#F34A53'});
                break;
            case 1:
                this.setState({backColor: '#AAC783'});
                break;
            case 2:
                this.setState({backColor: '#437356'});
                break;
        }
    }
        /*
        this.setState({running: activity});
        this.checkForActivity();
        */
    

    /*
    componentWillMount(){
    	//this.checkForActivity();
    }
    */
    checkForActivity(){
    	switch(this.state.running) {
    		case 0:
    			//Mashine is idle
    			this.setState({backColor: '#F34A53'});
    			break;
    		case 1:
    			//Mashine waits for NFC input
    			this.setState({backColor: '#AAC783'});
    			break;
    		case 2:
    			//Mashine is working
    			this.setState({backColor: '#437356'});
    			break;
    		default:
    			this.setState({backColor: '#FFFFFF'})
    			break;
    	}
    }
  
  	render(){
		return(
            <View>
            <Text>{this.state.name}</Text>
			<View style={[styles.container, {backgroundColor: this.state.backColor}]}>
				<Text></Text>
			</View>
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