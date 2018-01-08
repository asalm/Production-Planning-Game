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
		backgroundColor: 'transparent'
	},
	footer: {
		flex:0.2,
		position:'absolute',
		height:40,
		bottom:0,
		left:0,
		right:0,
		flexDirection:'row',
		backgroundColor:'#005096',
	},
	footerText: {
		marginTop:10,
		marginLeft:10,
		right:0,
		color:'white',
	},
	footerHowTo: {
		color:'white',
		//float:'right',
		right:0,
		alignSelf:'flex-end'
	},
	contentbox: {
		flex:1,
		flexDirection: 'column',
		padding:40
	},
	timerInfoText: {
		//alignSelf:'flex-start',
		fontSize: 18,
		color: '#212121'
	},
	timerText: { 
		//alignSelf:'flex-start',
		//paddingTop:5,
		//marginLeft:-150,
		fontSize:36,
		color: '#D50000'
	},
	productionInfoText: {
		fontSize:18,
		color: '#212121'
		//alignSelf:'flex-start'
	},
	productionText: {
		fontSize:36
		//alignSelf:'flex-start',
	},
	touchable: {
		width: 200,
		height: 40,
		backgroundColor:'#3F51B5'
	},
	touchableText: {
		marginTop:5,
		textAlign:'center',
		fontSize:18,
		color:'#fff'
	},
	WorkOrderWrapper: {
		flexDirection: 'column',
		flex:.3,
		position:'absolute',
		width:percentmargin,
		height:percentmargin,
		top:percentmargin-boxheight,
		marginLeft:percentmargin
	},
	directionsBox: {
		marginTop:100,
		//width: 600,
		height: 100,
		backgroundColor: 'transparent',
		alignItems: 'center',
		flexDirection: 'row'
	},
	contentWorkOrder: {
		//position: 'absolute',
		//flex:1,
		//top:percentmargin-boxheight,
		//height:boxheight+boxheight,
		//width: percentmargin,
		//marginLeft: percentmargin,
		backgroundColor: 'transparent',
		alignItems: 'center',
		flexDirection:'column'
	},
	contentWorkCheckIn: {
		//position: 'absolute',
		//top:boxheight,
		//width: percentmargin,
		alignItems: 'center',
		flexDirection:'column'
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
	titleText: {
		fontSize:36,
		marginLeft:20,
		marginBottom:5,
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
	containerRow: {
		marginTop:40,
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	container: {
	//height:height*0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    },
});

export{ppstyle};