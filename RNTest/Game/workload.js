/*workload.js*/

import React, { Component } from 'react';
import {
  Platform,
  TouchableOpacity,
  Text,
  View,
  ToastAndroid
} from 'react-native';
import {ppstyle} from '../style.js';
import NfcManager, {NdefParser} from 'react-native-nfc-manager';

class WorkLoad extends Component {

	constructor(props) {
		super(props);
     	this.state = {
            timer: "",
            type: '',
            units: "",
            active: 'In',
            working: false,
        }
        this._mounted;
        this.incrementer = null;
    }

    componentDidMount(){
    	this._mounted = true;
    }
  	componentWillUnmount(){
  		this._mounted = false;
  		if(this.incrementer != null){
  			clearInterval(this.incrementer);
  		}
  	}

	updateBasketState(nfctag){
		var requested = this.state.type;
		var workingState = this.state.working;
        var letter = nfctag.ndefMessage[0].payload[3];
        var number = nfctag.ndefMessage[0].payload[4];
        var basketid = "";
        if(letter !== null && number !== null){
            basketid = String.fromCharCode.apply(null, [letter, number]);
        } else {
            basketid = "Error";
        }
        if(this._mounted){
        	if(basketid === requested && workingState === false){
        		this.setState({working: true, info: "Start Producing"}); 
	  			this.incrementer = setInterval( () =>		
		  			this.setState({
		        		timer: this.state.timer + 1
		      		})
		      		
	    		, 1000);
  			}else if(basketid !== requested){
  				ToastAndroid.show("Not the right Basket!", ToastAndroid.SHORT);
  			}else if(workingState === true && basketid === requested){
  				this.setState({working: false, info: "Check Out"});
  				clearInterval(this.incrementer);
  			}
  		}
        //this.setState({basket: basketid});
    }

  	CheckIn = () => {
  		var workingState = this.state.active;
  		var prodTime, prodType, prodUnit, info;
  		if(workingState === 'In'){
  			this._startDetection();
  			workingState = 'Out';
  			prodTime = 0;
  			prodType = "C0";
  			prodUnits = 8;
  			prodInfo = "Scan your Basket now";
  			
  		}else{
  			this._stopDetection();
  			workingState = 'In';
  			prodTime = 0;
  			prodType = "";
  			prodUnits = "";
  			prodInfo = "Wait for your next Workorder";

  			clearInterval(this.incrementer);
  		}
  		//Debug#
  		this.setState({timer: prodTime, type: prodType, units: prodUnits, active: workingState, info: prodInfo});
  		//this.setState({active: workingState});
  		//console.warn(this.state.active);
  	}

  	render(){
  		let {timer, type, units, active, info} = this.state;
		return(
		<View style={ppstyle.WorkOrderWrapper}>
			<View  style={ppstyle.contentWorkOrder}>

				<Text style={ppstyle.timerInfoText}>Your Production Time:</Text>
				<Text style={ppstyle.timerText}>{timer}</Text>

				<Text style={ppstyle.productionInfoText}>Units to Produce:</Text>
				<Text style={ppstyle.productionText}>{type} - {units}</Text>
			</View>

			<View style={ppstyle.contentWorkCheckIn}>
				<TouchableOpacity 
					style={ppstyle.touchable}  
					onPress={this.CheckIn}>
					<Text style={ppstyle.touchableText}>Check {active}</Text>
	          	</TouchableOpacity>
	          	<Text style={ppstyle.productionInfoText}>{info}</Text>
			</View>
		</View>

		);
  	}

    _startDetection = () => {
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.log('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }
    _onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        //this.setState({ tag });
        this.updateBasketState(tag);
      
    }
}

export {WorkLoad};