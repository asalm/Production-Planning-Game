import {StyleSheet, Dimensions} from 'react-native';
/**
 * this JS defines regular styles used thoughout the application to get rid of all the inline CSS code 
 */

var {height,width} = Dimensions.get('window');

var boxheight = height / 8;
var percentmargin = width / 3;
const ppstyle = StyleSheet.create({
	contentTop: {
		height: boxheight,
		position: 'absolute',
		alignItems: 'center',
		top:20,
		left:20,
		right:20,
		flexDirection:'row',
		justifyContent: 'center',
		backgroundColor: 'green'
	},
	contentbox: {
		flex:1,
		flexDirection: 'column',
		padding:40
	},
	contentWorkOrder: {
		position: 'absolute',
		top:percentmargin-boxheight,
		height:boxheight+boxheight,
		width: percentmargin,
		marginLeft: percentmargin,
		backgroundColor: 'blue'
	},

	highlight: {
		fontSize:24,
		color: '#d9edf7',
		fontWeight: 'bold'
	},
	basic: {
		fontSize:18,
		color: '#000000',
		fontWeight: 'normal'
	},
	important: {
		fontSize:36,
		color: '#005096',
		fontWeight: '800',
		textAlign: 'center'
	},
	textFieldBasic: {
		height:36,
		width: 120,
		borderColor:'#005096',
		borderRadius:50,
		borderWidth:1
	},
	container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    },
});

export{ppstyle};