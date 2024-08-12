const { default: axios } = require('axios');
const express = require('express');
const base64 = require('base-64');
const qs = require('qs');

const app = express();

const clientId = '1FAB3365F7E24CC89541A04B15315F8B';
const clientSecret = 'OMJ7wqrgC_SSVdcXQR3h85dmXpOXXEPLbR96y3HwtrDL3A_C';
const redirectUri = 'http://xero-noe-api.fqg8b4gsgdcme6dp.southindia.azurecontainer.io:3001/callback';

let storedRefreshToken = '';
app.get('/health',(req,res)=>{res.status(200).json({msg:"healthy and running !"})})
app.get('/',(req,res) => {res.send('<h1>Hello World</h1><a href="/auth">Connect to Xero</a>')});

app.get('/auth', (req,res) => {
    const authorizationUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=offline_access accounting.transactions.read`;
    res.redirect(authorizationUrl);
});

app.get('/callback', async (req,res) => {
    const authorizationCode = req.query.code;
    console.log("AUTHORIZATION: ", base64.encode(`${clientId}:${clientSecret}`));
    console.log("AUTHORIZATION_CODE: ",authorizationCode);
    try {
        const response = await axios.post('https://identity.xero.com/connect/token', qs.stringify({
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: redirectUri
        }), {
          headers: {
            'Authorization': `Basic ${base64.encode(`${clientId}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }});
    
        const { access_token, refresh_token } = response.data;
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);
    
        storedRefreshToken = refresh_token; // Store this securely
        
        res.send(`Access Token: ${access_token}<br>Refresh Token: ${refresh_token}`);
      } catch (error) {
        console.log("EXCEPTION_IN_CALLBACK: ", error.response ? error.response.data : error.message);
        res.send(`Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
      }
});

app.get('refresh_token', async (req, res) => {
    try{
        
    }
    catch(exception){

    }
})

app.listen(3001, console.log("SUCCESSFULLY_RUNNING"));
