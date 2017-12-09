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

        var requestedType;
        this._mounted;
        this.incrementer = null;

        //Create Socket here
    }

    componentDidMount(){
    	this._mounted = true;

      //Create all socket connection stuff
      /*

      socket.on(workorder, (data) => {
        produce(data.type, data.amount)
      });


      */
    }
  	componentWillUnmount(){
  		this._mounted = false;
  		if(this.incrementer != null){
  			clearInterval(this.incrementer);
  		}
  	}

  convertTagtoChar(nfctag){
    var letter = nfctag.ndefMessage[0].payload[3];
    var number = nfctag.ndefMessage[0].payload[4];
    var basketid = "";
    if(letter !== null && number !== null){
      basketid = String.fromCharCode.apply(null, [letter, number]);
    } else {
      basketid = "Error";
    }
    return basketid;
  }

	updateBasketState(nfctag){
		var requested = this.state.type;
		var workingState = this.state.working;
    var basketid = convertTagToChar(nfctag)
        if(this._mounted){
        	if(basketid === requested){
        		this.setState({working: true, info: "Start Producing"}); 
  	  			this.incrementer = setInterval( () =>		
  		  		this.setState({
  		       		timer: this.state.timer + 1
  		      })
		      		
	    		, 1000);
  			}else if(basketid !== requested){
  				ToastAndroid.show("Not the right Basket!", ToastAndroid.SHORT);
  			}
  		}
        //this.setState({basket: basketid});
    }

    produce(type, amount) {
      var workingState = this.state.active;
      var prodTime, prodType, prodUnit, info;

      if(workingState === true){
        //add requested type + amount to Queue
      }else{
        workingState = true
        prodTime = 0
        prodType = type
        prodUnits = amount
        prodInfo = "Scan your Basket now"
        this._startDetection()
      }
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
        if(this.state.working === false){
        global.workingState[global.name] = 2;
        this.updateBasketState(tag);
        else{
          if(convertTagtoChar(tag) === this.state.type){
            this._stopDetection();
            clearInterval(this.incrementer);
            //socket.emit("finished", {time: this.state.timer})
          } 
        }
      
    }
}

export {WorkLoad};