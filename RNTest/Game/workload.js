import React, { Component } from 'react';
import {
  Platform,
  Button,
  Text,
  View,
  ToastAndroid
} from 'react-native';
import {ppstyle} from '../style.js';
import renderIf from '../renderIf.js';
import {Directions} from './Guides/direction.js';
import NFChelper from './nfchelper.js';
import NfcManager, {NdefParser} from 'react-native-nfc-manager';

//JUST FOR TESTING ENVIRONMENT

class WorkLoad extends Component {

	constructor(props) {
		super(props);
   	this.state = {
      timer: "",
      type: '',
      units: "",
      active: 'In',
      working: false,
      preproduce: false,
    }

    var requestedType;
    this._mounted;
    this.incrementer = null;
    this.queue = [];
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
  convertTagtoChar = (nfctag) => {
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

	updateBasketState = (nfctag) => {
    //this.props.callbackParent({name: global.name});

		var requested = this.state.type;
		var workingState = this.state.working;
    var basketid = this.convertTagtoChar(nfctag);
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
    //Preproduction method to tell the User what is needed for the Game to start.
    preproduce(type, amount){
      this.setState({preproduce: true, type: type, units: amount,prodInfo: 'Create Products now'});
    };

    //Method to trigger the production of a specific type and amount
    produce = (type, amount) =>{
      var workingState = this.state.active;
      var prodTime, prodType, prodUnit, info;

      if(workingState === true){
        //add requested type + amount to Queue
        this.queue.push({type: type, quan: amount});
        console.log(this.queue);
      }else{
        workingState = true;
        prodInfo = "Scan your Basket now";
        prodTime = 0

        if(this.queue.length < 1){

          prodType = type
          prodUnits = amount
        }else{
          let latestInQueue = this.queue.unshift();
          prodType = latestInQueue.type;
          prodUnits = latestInQueue.amount;
        }
        this.setState({timer: prodTime, type: prodType, units: prodUnits, active: workingState, info: prodInfo});

        this._startDetection()

      }
    }

  	CheckIn = () => {
      if(this.state.preproduce){
        this.setState({preproduce:false, type: '', units: ''});
        //Signal Parent that you're done, so the Server also can know.
        this.props.callbackParent({id: 'preproductionFin', name: global.name});

      }else{
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
      }
  		//Debug#
  		//this.setState({timer: prodTime, type: prodType, units: prodUnits, active: workingState, info: prodInfo});
  		//this.setState({active: workingState});
  		//console.warn(this.state.active);
  	}

  	render(){
  		let {timer, type, units, active, info} = this.state;
		return(
		<View style={ppstyle.WorkOrderWrapper}>
      <View style={ppstyle.contentWorkOrder}>
			
        {renderIf(!this.state.preproduce, <Text style={ppstyle.timerInfoText}>Your Production Time:</Text>)}
			  {renderIf(!this.state.preproduce, <Text style={ppstyle.timerText}>{timer}</Text>)}


				{renderIf(!this.state.preproduce, <Text style={ppstyle.productionInfoText}>Units to Produce:</Text>)}
				{renderIf(!this.state.preproduce, <Text style={ppstyle.productionText}>{type} - {units}</Text>)}

        {renderIf(this.state.preproduce, <Text style={ppstyle.productionInfoText}>For the Game to start, you need</Text>)}
        {renderIf(this.state.preproduce, <Text style={ppstyle.timerInfoText}>{units} units of product: {type}</Text>)}
			</View>

			<View style={ppstyle.contentWorkCheckIn}>
      {renderIf(this.state.preproduce, <Button onPress={this.CheckIn} title="Done" color="#3F51B5"/>)}
      {/*}
      <TouchableOpacity style={ppstyle.touchable} onPress={this.CheckIn}>
        {renderIf(!this.state.preproduce, <Text style={ppstyle.touchableText}>Check {active}</Text>)}
        {renderIf(this.state.preproduce, <Text style={ppstyle.touchableText}>Done</Text>)}
	     </TouchableOpacity>
       */}
	     <Text style={ppstyle.productionInfoText}>{info}</Text>
        
			</View>

      {/*
        Here is where the directions for the Workorder are rendered
      */}
      <View style={ppstyle.directionsBox}>
        {renderIf(this.state.working,
        <Directions type={this.state.type}></Directions>
        )}
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
          //global.workingState[global.name] = 2;
          this.updateBasketState(tag);
        }else{
          let tagID = this.convertTagtoChar(tag);
          if(tagID === this.state.type){
            this._stopDetection();
            clearInterval(this.incrementer);
            global.time += this.state.time;
            global.amount += this.state.units;

            this.props.callbackParent({name: global.name,time: this.state.timer,product:this.state.type});
            this.setState({timer: '', type: '', units:'', working:false, info: 'Wait for next order'});

            if(this.queue.length > 1){
              // Start Detection again!
            }else{
              //this.setState({timer: '', type: '', units:'', working:false})
            }
          } 
        }
      
    }
}

export {WorkLoad};