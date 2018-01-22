import React, { Component } from 'react';
import {
  Platform,
  Button,
  Text,
  View,
  ToastAndroid
} from 'react-native';
//For implementation look at the package from the Android Studio Project 
import NfcManager, {NdefParser} from 'react-native-nfc-manager';

import {ppstyle} from '../style.js';
import renderIf from '../renderIf.js';
import {Directions} from './Guides/direction.js';

class WorkLoad extends Component {

	constructor(props) {
		super(props);
	   	this.state = {
	      timer: "",
	      product: '',
	      amount: "",
	      working: false,
	      preproduce: false,
	    }

	    this.detectMode = false;    //Leaving the detection on is better than continous on/off
	    							//If detectMode = true, _onTagDiscovered can react to what happens.

    	this.incrementer = null;	//Variable holding the timer

    	this.queue = []; //Queue System for incoming workorders, if a workorder is already scheduled or in Progress
    	
    	this.checkoutAlert = false; //Reminder to Check out after finishing a Product
  	}
  	//App Lifecycle
  	componentDidMount(){
  		this._startDetection();
  	}
 	componentWillUnmount(){
 		if(this.incrementer != null){
 			this.incrementer = null;
 			this.reset();
 		}
 		this._stopDetection();
 	}

 	//Helper Function for converting the specific positions inside the NFC Payload from Asciicode to actual String
	convertTagtoChar = (nfctag) => {
	    try{
	    	var letter = nfctag.ndefMessage[0].payload[3];
	    	var number = nfctag.ndefMessage[0].payload[4];
	    	var basketid = "";
	    	if(letter !== null && number !== null){
	    		basketid = String.fromCharCode.apply(null, [letter, number]);
	    	}
	    }catch(err){}
	    
	    return basketid;
	}

	//Once a game is done, we reset all parameters to empty values
	reset = () => {
		this.setState({timer:'',product:'',amount:'',working:false,preproduce:false});
 		this.detectMode = false; 
    	this.incrementer = null;
    	this.queue = [];
    	this.checkoutAlert = false;
	}    
	work = () => {
		this.setState({working: true, info: "Start Producing"});
		this.props.callbackParent({id:'prodStart',amount:this.state.amount,product:this.state.product});
 
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
  	//Function to call, when a product is finished)
  	productFinished = () => {
    	this.checkoutAlert = false;
    	this.detectMode = false;
    	//This replys to the Parent which then sends those informations to the socket.io instance on the server
    	this.props.callbackParent({id:'productFin',name: global.name,time: this.state.timer,product:this.state.product, amount: this.state.amount});
    	this.setState({timer: '',product:'',amount:'',info:'Wait for next Order',working:false});

    	if(this.queue.length > 0){
    		var q = this.queue.shift();
    		console.log('App: First out of Queue is ' + q.product + ":" + q.amount);
    		produce(this.queue[0].product,this.queue[0].amount);
    	}
  	}
  	/*
	updateBasketState = (nfctag) => {
		var requested = this.state.type;
		var workingState = this.state.working;
    	var basketid = this.convertTagtoChar(nfctag);
        if(this._mounted){
        	if(basketid === requested){
            
  		
        //this.setState({basket: basketid});
      }
    */
    //Preproduction method to tell the User what is needed for the Game to start.
    preproduce =(type, amount)=>{
      this.setState({preproduce: true, product: type, amount: amount,prodInfo: 'Create Products now'});
    }

    //Method to trigger the production of a specific product and amount
    produce = (type, amount) =>{
    	if(this.state.working){
    		this.queue.push({product:type, amount:amount});

    		//Console for Queue and whats inside
    		console.log('App: Queue Status:');
    		console.log('App: Queue length is ' + this.queue.length);
    		for(var i = 0; i < this.queue.length; i++){
    			console.log('App: Queue at ' + i + ": " + this.queue[i].product + " - " + this.queue[i].amount);
    		}
    	}else{
    		ToastAndroid.show('Scan your basket now', ToastAndroid.SHORT);
    		this.setState({timer: 0, product: type, amount: amount, info:'Scan your basket now'});
    		this.detectMode = true;
    	}
    }
    //This is used to check if workload is currently active.
    reportWorkingState = () => {
      return this.state.working;
    }

  	CheckIn = () => {
      if(this.state.preproduce){
        this.setState({preproduce:false, type: '', units: ''});
        //Signal Parent that you're done, so the Server also can know.
        this.props.callbackParent({id: 'preproductionFin', name: global.name});      
      }
  	}

  	render(){
  		let {timer, product, amount, info} = this.state;
		  return(
    		<View style={ppstyle.WorkOrderWrapper}>
          <View style={ppstyle.contentWorkOrder}>
    			
            {renderIf(!this.state.preproduce, <Text style={ppstyle.timerInfoText}>Your Production Time:</Text>)}
    			  {renderIf(!this.state.preproduce, <Text style={ppstyle.timerText}>{timer}</Text>)}


    				{renderIf(!this.state.preproduce, <Text style={ppstyle.productionInfoText}>Units to Produce:</Text>)}
    				{renderIf(!this.state.preproduce, <Text style={ppstyle.productionText}>{product} - {amount}</Text>)}

            {renderIf(this.state.preproduce, <Text style={ppstyle.productionInfoText}>For the Game to start, you need</Text>)}
            {renderIf(this.state.preproduce, <Text style={ppstyle.timerInfoText}>{amount} units of product: {product}</Text>)}
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
            <Directions product={this.state.product}></Directions>
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

        var tagID = this.convertTagtoChar(tag);
        //var woInProgress = false;
        console.log('App: Discovered Basket with ' + tagID);

        //Ready to start a workorder
        if(this.detectMode && !this.state.working){
        	if(tagID.toString() === this.state.product.toString()){
        		this.work();
        	}else{
        		ToastAndroid.show('This is not the right basket.',ToastAndroid.SHORT);
        	}
        //Check out a Workorder
        }else if(this.detectMode && this.state.working){
        	if(tagID.toString() === this.state.product.toString()){
        		if(this.queue.length > 0){
        			ToastAndroid.show('Prepare for next Workorder',ToastAndroid.SHORT);
        		}
        		clearInterval(this.incrementer);
          		global.time += this.state.time;
          		global.amount += this.state.amount;
          		this.productFinished();
        	}else{
        		ToastAndroid.show('This is not the right basket.',ToastAndroid.SHORT);
        	}

        //Not in DetectMode!
        }else if(!this.detectMode){
        	ToastAndroid.show('Wait for incoming workorder to start production',ToastAndroid.SHORT);
        }else{
        	console.log('App: This Case is uncaught.');
        }
    }
}

export {WorkLoad};