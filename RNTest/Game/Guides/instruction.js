import React, { Component } from 'react';
import {
  Platform,
  Button,
  Text,
  ScrollView,
  Image,
  ToastAndroid
} from 'react-native';
import {ppstyle} from '../../style.js';

class Instructions extends Component {

	constructor(props) {
		super(props);

	}

	render(){
		return(
		<ScrollView style={ppstyle.instructionBox}>
		<Text style={ppstyle.timerText}>
			Workstation 1 - Cutting
		</Text>
		<Image style={{width:400,height:100}} source={require('../../img/ws1.png')} resizeMode="contain"></Image>
		<Text style={ppstyle.productionInfoText}>
			Take the raw material (paper) and produce the requested number of pieces. Conducting this working step material A0 is produced.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		MRP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. An order appears on the screen.{'\n'}
		2. Check in.{'\n'}
		3. Take the raw material (paper).{'\n'}
		4. Cut products according to the order amount.{'\n'}
		5. Check out.{'\n'}
		6. Put the products to the inventory in front of the next machine (no capacity limit).{'\n'}
		Equipment: One container to produce.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		KANBAN{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. The next workstation takes the products A0 and withdraws a Kanban container.{'\n'}
		2. Check in.{'\n'}
		3. Take the raw material.{'\n'}
		4. Cut products according to the order amount.{'\n'}
		5. Check out.{'\n'}
		6. Fill the Kanban container with the produced products.{'\n'}
		Equipment: Default setting is the number of Kanban containers according to the defined Kanbans per product to work and store the products. The Kanban container are withdrawn from the next workstation.
		{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
			CONWIP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. The requested final product will appear in the screen.{'\n'}
		2. Take the labelled container.{'\n'}
		3. Check in.{'\n'}
		4. Take the raw material.{'\n'}
		5. Cut products according to the order amount.{'\n'}
		6. Check out.{'\n'}
		7. Put the container together with the pieces to the next workstation.{'\n'}
		8. Check the screen of the website for the next order.{'\n'}{'\n'}
		Equipment: The container with the customer order information is taken after production from the workstation to the next workstation.
		</Text>
		<Text style={ppstyle.timerText}>
			Workstation 2 - Surface
		</Text>
		<Image style={{width:400,height:100}} source={require('../../img/ws2.png')} resizeMode="contain"></Image>
		<Text style={ppstyle.productionInfoText}>
		The previously cut pieces (A0) are now painted with a marker as seen in the image above. Afterwards, the new product is called B0.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		MRP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. An order appears on the screen.{'\n'}
		2. The specific quantity of the submaterial is taken from the inventory in front of the workstation.{'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step.{'\n'}
		5. Check out.{'\n'}
		6. Put the produced products to the inventory in front of the next machine (no capacity limit).{'\n'}
		Equipment: Two containers. One for production, and one container as storage before the workstation.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		KANBAN{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. The next workstation takes the products B0 and withdraws a Kanban container.{'\n'}
		2. If the submaterials (A0) are available in inventory start production. {'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step.{'\n'}
		5. Check out.{'\n'}
		6. Fill the Kanban container with the produced products an put the container in front of the next workstation (Attention to the Kanban lotsize).{'\n'}{'\n'}
		Equipment: Default setting are two Kanban container each used for production and storage. The next workstation withdraws the Kanban container. {'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		CONWIP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. As soon as a labelled container from the previous container arrives, start production.{'\n'}
		2. Check in.{'\n'}
		3. Execute the individual work step to produce the right final product. {'\n'}
		4. Check out.{'\n'}
		5. Put the container together with the pieces to the next workstation. {'\n'}{'\n'}
		Equipment: None. The container with the customer order information is taken from the previous workstation and transported after production to the next workstation.
		</Text>

		<Text style={ppstyle.timerText}>
			Workstation 3 - Paint
		</Text>
		<Image style={{width:400,height:100}} source={require('../../img/ws3.png')} resizeMode="contain"></Image>
		<Text style={ppstyle.productionInfoText}>
			The cut and painted parts from workstation 1 and workstation 2 (B0) must be painted according to the figure above. Afterwards, these pieces are transformed to product C0.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		MRP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. An order appears on the screen.{'\n'}
		2. The specific quantity of the submaterial is taken from the inventory in front of the workstation.{'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step to produce the right final product.{'\n'}
		5. Check out.{'\n'}
		6. Put the produced products to the inventory in front of the next machine (no capacity limit).{'\n'}
		Equipment: Two containers. One for production, and one container as storage before the workstation.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		KANBAN{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. The next workstation takes the products C0 and withdraws the respective Kanban container.{'\n'}
		2. If the submaterials (B0) are available in the inventory start production. {'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step.{'\n'}
		5. Check out.{'\n'}
		6. Fill the Kanban container with the produced products an put the container in front of the next workstation (Attention to the Kanban lotsize).{'\n'}
		Equipment: Default setting is a Kanban container to work and store the products. The products are taken from the next workstation. {'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		CONWIP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. As soon as a labelled container from the previous container arrives start production.{'\n'}
		2. Check in.{'\n'}
		3. Execute the individual work step to produce the right final product. {'\n'}
		4. Check out.{'\n'}
		5. Send the container with the pieces to the next workstation. {'\n'}
		Equipment: None. The container with the customer order information is taken from the previous workstation and transported after production to the next workstation.
		</Text>
		<Text style={ppstyle.timerText}>
			Workstation 4 - Assembly
		</Text>
		<Image style={{width:400,height:100}} source={require('../../img/ws40.png')} resizeMode="contain"></Image>
		<Image style={{width:400,height:100}} source={require('../../img/ws41.png')} resizeMode="contain"></Image>

		<Text style={ppstyle.productionInfoText}>
			Take the pieces from the workstation 3 (CO) and paint them with the colours as seen in the figure above. Depending on the product D0 or D1, paint the product yellow for D0 or blue for D1.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		MRP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. An order appears on the screen.{'\n'}
		2. The specific quantity of the submaterial is taken from the inventory in front of the workstation.{'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step.{'\n'}
		5. Check out.{'\n'}
		6. Put the produced products to the inventory in front of the next machine (no capacity limit){'\n'}
		Equipment: 4 containers. 2 container to produce (D0 or D1), and 2 to store the produced products (D0 and D1; no capacity limit).{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		KANBAN{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. The next workstation takes the products D0 or D1 and withdraws a Kanban container.{'\n'}
		2. If the submaterials (C0) are available in the inventory start production. {'\n'}
		3. Check in.{'\n'}
		4. Execute the individual work step.{'\n'}
		5. Check out.{'\n'}
		6. Fill the Kanban container with the produced products D0 or D1 and put the container in front of the next workstation (Attention to the Kanban lotsize).{'\n'}
		Equipment: Default settings are 2 Kanban containers for products D0 and D1 respectively to produce and store the products. The next workstation withdraws the containers of D0 and D1.{'\n'}{'\n'}
		</Text>
		<Text style={ppstyle.productionText}>
		CONWIP{'\n'}
		</Text>
		<Text style={ppstyle.productionInfoText}>
		1. As soon as a labelled container from the previous container arrives, start production.{'\n'}
		2. Check in.{'\n'}
		3. Execute the individual work step to produce the right final product. {'\n'}
		4. Check out.{'\n'}
		5. Send the container with the pieces to the next workstation. {'\n'}
		Equipment: None. The container with the customer order information is taken from the previous workstation and transported after production to the next workstation.
		</Text>

		<Text style={ppstyle.timerText}>
			Workstation 5 - Finalise
		</Text>
		<Image style={{width:400,height:100}} source={require('../../img/ws50.png')} resizeMode="contain"></Image>
		<Image style={{width:400,height:100}} source={require('../../img/ws51.png')} resizeMode="contain"></Image>
		<Image style={{width:400,height:100}} source={require('../../img/ws52.png')} resizeMode="contain"></Image>


		<Text style={ppstyle.productionInfoText}>
		Take the pieces from the workstation 4 (D0 and D1) and paint them according to the figure above. Depending on the final product requirement, paint the piece with blue for E0, green for E1 or purple for E2.
{'\n'}{'\n'}
</Text>
<Text style={ppstyle.productionText}>
MRP{'\n'}
</Text>
<Text style={ppstyle.productionInfoText}>
1. An order appears on the screen.{'\n'}
2. The specific quantity of the submaterial D0 or D1 is taken from the inventory in front of the workstation.{'\n'}
3. Check in.{'\n'}
4. Execute the individual work step.{'\n'}
5. Check out.{'\n'}
6. Put the produced products to the finished good inventory after workstation 5{'\n'}
Equipment: 6 containers. 3 container to produce (E0, E1 or E2), and 3 representing the finished good inventory for products E0, E1 and E2 (no capacity limit). {'\n'}{'\n'}
</Text>
<Text style={ppstyle.productionText}>
KANBAN{'\n'}
</Text>
<Text style={ppstyle.productionInfoText}>
1. The customer takes the final products E0, E1 and E2 and withdraws a Kanban container.{'\n'}
2. If the submaterials E0 or E1 are available in the inventory, start production. {'\n'}
3. Check in.{'\n'}
4. Execute the individual work step.{'\n'}
5. Check out.{'\n'}
6. Fill the Kanban container with the produced products an put the container in the finished good inventory after workstation 5 (Attention to the Kanban lotsize){'\n'}
Equipment: Default settings are 3 Kanban containers to work and store the products in the finished good inventory. The customer takes the final products from there if they are available. {'\n'}{'\n'}
</Text>
<Text style={ppstyle.productionText}>
CONWIP{'\n'}
</Text>
<Text style={ppstyle.productionInfoText}>
1. As soon as a labelled container from the workstation 4 arrives start production.{'\n'}
2. Check in.{'\n'}
3. Execute the individual work step to produce the required final product.{'\n'}
4. Check out.{'\n'}
5. Put the container to the finished good inventory after workstation 5. {'\n'}
Equipment: None. The container with the customer order information is taken from the previous workstation and transported after production to the finished good inventory.	
		</Text>
		</ScrollView>
		);
	}
}

export {Instructions};