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

//Toast for everything you need to do!!!
//Lead the player through the process of checking in and out

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
    this.checkoutAlert = false;
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
    try{
      var letter = nfctag.ndefMessage[0].payload[3];
      var number = nfctag.ndefMessage[0].payload[4];
      var basketid = "";
      if(letter !== null && number !== null){
        basketid = String.fromCharCode.apply(null, [letter, number]);
      } else {
        basketid = "Error";
      }
    }catch(err){}
    
    return basketid;
  }

  //Once a game is done, we reset all parameters to empty values
  reset = () => {
    this.setState({timer:'',type:'',units:'',active:'In',working:false,preproduce:false});
    
  }
  productFinished = () => {
    this.checkoutAlert = false;
    this.setState({working:false,active:false});
    this.props.callbackParent({id:'productFin',name: global.name,time: this.state.timer,product:this.state.type, amount: this.state.units});
  }
	updateBasketState = (nfctag) => {
		var requested = this.state.type;
		var workingState = this.state.working;
    var basketid = this.convertTagtoChar(nfctag);
        if(this._mounted){
        	if(basketid === requested){
            this.props.callbackParent({id:'prodStart',amount:this.state.units,product:this.state.type});
        		this.setState({working: true, info: "Start Producing"}); 
  	  			this.incrementer = setInterval( () =>	{	
    		  		this.setState({
    		       		timer: this.state.timer + 1
    		      });
              
              if(this.state.timer > 6 && !this.checkoutAlert){
                this.checkoutAlert = true;
                ToastAndroid.show("If you're done working, you can scan your basket to check out",ToastAndroid.SHORT);
              }
            }, 1000);
          }
  			}else if(basketid !== requested){
  				ToastAndroid.show("Not the right Basket!", ToastAndroid.SHORT);
  			}
  		
        //this.setState({basket: basketid});
      }
    //Preproduction method to tell the User what is needed for the Game to start.
    preproduce =(type, amount)=>{
      this.setState({preproduce: true, type: type, units: amount,prodInfo: 'Create Products now'});
    }

    //Method to trigger the production of a specific product and amount
    produce = (type, amount) =>{
      ToastAndroid.show('Scan your Basket now!',ToastAndroid.LONG);
      //var workingState = this.state.active;
      var prodTime, prodType, prodUnit, info;
      //workingState = true;
      prodInfo = "Scan your Basket now";
      prodTime = 0;   
      prodType = type;
      prodUnits = amount;
      this.setState({timer: prodTime, type: prodType, units: prodUnits, active: true, info: prodInfo});
      this._startDetection();
    }
    //This is used to check if workload is currently active.
    reportWorkingState = () => {
      return this.state.active;
    }

  	CheckIn = () => {
      if(this.state.preproduce){
        this.setState({preproduce:false, type: '', units: ''});
        //Signal Parent that you're done, so the Server also can know.
        this.props.callbackParent({id: 'preproductionFin', name: global.name});      
      }
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
    	     <Text style={ppstyle.productionInfoText}>{info}</Text>
            
    			</View>

          {/*
            Here is where the directions for the Workorder are rendered
          */}
          <View style={ppstyle.directionsBox}>
            {renderIf(this.state.working,
            <Directions type={this.state.product}></Directions>
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
      console.log('App: Discovered Basket with' + tag);
      
      if(!this.state.working){
        console.log('App: User checked in');
        //global.workingState[global.name] = 2;
        this.updateBasketState(tag);
      }else{
        let tagID = this.convertTagtoChar(tag);
        //since its unrealistic to finish something in less then 6 seconds we use the checkoutAlert value
        //to also be true for the Detection to stup again.
        if(tagID === this.state.type && this.state.working && this.checkoutAlert){
          console.log('App: User checked out');
          this._stopDetection();
          clearInterval(this.incrementer);
          global.time += this.state.time;
          global.amount += this.state.units;
          this.productFinished();
          this.setState({timer: 0, type: '', units:'',active:false, working:false, info: 'Wait for next order'});
        } 
      }
    }
}

export {WorkLoad};