import React, { Component } from 'react';
import {
  Platform,
  Button,
  Text,
  View,
  Image,
  ToastAndroid
} from 'react-native';
import {ppstyle} from '../../style.js';
import renderIf from '../../renderIf.js';

let path = '../../img/'

class Directions extends Component {

	constructor(props) {
		super(props);
		this.state = {
			path:'',
		}
        this.path = '';
		console.log("App: Component recieved following Props: " + this.props.type);
    }

    setImagePath(){
    	let productID = this.props.type
    	switch(productID){
    		case "A0":
    			imgpath = require('../../img/ws1.png');
    			break;
    		case "B0":
    			imgpath = require('../../img/ws2.png');
    			break;
    		case "C0":
    			imgpath = require('../../img/ws3.png');
    			break;
    		case "D0":
    			imgpath = require('../../img/ws40.png');
    			break;
    		case "D1":
    			imgpath = require('../../img/ws41.png');
    			break;
    		case "E0":
    			imgpath = require('../../img/ws50.png');
    			break;
    		case "E1":
    			imgpath = require('../../img/ws51.png');
    			break;
    		case "E2":
    			imgpath = require('../../img/ws52.png');
    			break;
    		default:
    			console.log('unable to determine which resource needs to be loaded');
    			break;
    	}
    	this.path = imgpath;
        console.log("App Directions-Render : " + this.path);

    }

    componentWillMount(){
    	this.setImagePath();
    }
    componentWillUnmount(){
        this.path = '';
    }
    shouldComponentUpdate(){
    }

    render(){
    	return(
    	<View>
    		<Image style={{width:400,height:100}} source={this.path} resizeMode="contain"></Image>
    	</View>
    	);
    }
}

export {Directions};

