import React, { Component } from 'react';
import {ppstyle} from './style.js';
import { AppRegistry, TextInput } from 'react-native';

class BasicTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '...' };
  }

  render() {
    return (
      <TextInput
        style={ppstyle.textFieldBasic}
        onChangeText={(text) => this.setState({text})}
        value={this.state.text}
      />
    );
  }
}

export {BasicTextInput};