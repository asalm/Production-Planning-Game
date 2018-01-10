class NFCHelper {
	
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
}

export {NFCHelper};