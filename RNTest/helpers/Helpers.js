//Helper Class


export async function loginFetch(username, password){
//Authentication endpoint Route be like
const authEndpointRoute = "http://ppc-game.fhstp.ac.at/oauth/token";
console.warn('fetching data');
      //this.response = Helpers.loginFetch('machine1','secret');
      try{
      let sToken = await fetch(authEndpointRoute, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 2,
          client_secret: 'wY0NIjiEHQNz51IVOxaTwr4cfDmgotLheX80bGX2',
          grant_type: 'password',
          username: 'machine1',
          password: 'secret',
          scope: '*'
        })
      })
      //var response = await sToken.json();
      //response = JSON.stringify(response.access_token);
      //return response;//this.response = await sToken.json();
      return await sToken.json();
      } catch( error ){
        console.error(error);
      }
}