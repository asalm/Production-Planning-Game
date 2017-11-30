
import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    ToastAndroid,
    TouchableOpacity,
    Linking
} from 'react-native';
import {ppstyle} from './style.js';
import NfcManager, {NdefParser} from 'react-native-nfc-manager';

class NFCReader extends Component {
  constructor(props) {
    super(props);
     this.state = {
            supported: true,
            enabled: false,
            basket: "No NFC",
        }
    }
    
    //Lifecycle Functions
    componentWillMount() {
        this._startDetection();
        //Debug
        ToastAndroid.show("Detection started", ToastAndroid.SHORT);   
    }
   
    componentWillUnmount() {
        this._stopDetection();
        //Debug
        ToastAndroid.show("Detection stopped", ToastAndroid.SHORT);
    }
    
    updateBasketState(nfcrecord){
        var letter = nfctag.ndefMessage[0].payload[3];
        var number = nfctag.ndefMessage[0].payload[4];
        var basketid = "";
        if(letter !== null && number !== null){
            basketid = String.fromCharCode.apply(null, [letter, number]);
        } else {
            basketid = "Error";
        }
        this.setState({basket: basketid});
    }
    
    //Render function (Also lifecycle)
    render() {
        let { supported, enabled, basket } = this.state;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{`Is NFC supported ? ${supported}`}</Text>
                <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text>

                
                <TouchableOpacity style={{ marginTop: 20 }} onPress={this._clearMessages}>
                    <Text>Clear</Text>
                </TouchableOpacity>


                <Text style={{ marginTop: 20 }}>{JSON.stringify(basket)}</Text>
            </View>
        )
    }

    _onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        //this.setState({ tag });
        this.updateBasketState(tag);
        /*let url = this._parseUri(tag);
        if (url) {
            Linking.openURL(url)
                .catch(err => {
                    console.warn(err);
                })
        }*/
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

    _clearMessages = () => {
        this.setState({tag: null});
    }

    _goToNfcSetting = () => {
        if (Platform.OS === 'android') {
            NfcManager.goToNfcSetting()
                .then(result => {
                    console.log('goToNfcSetting OK', result)
                })
                .catch(error => {
                    console.warn('goToNfcSetting fail', error)
                })
        }
    }

    /*
    _parseUri = (tag) => {
        let result = NdefParser.parseUri(tag.ndefMessage[0]),
            uri = result && result.uri;
        if (uri) {
            console.log('parseUri: ' + uri);
            return uri;
        }
        return null;
    }
    */
}

export {NFCReader};