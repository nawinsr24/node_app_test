const { default: axios } = require('axios');
const express = require('express');

const app = express();

const clientId = '1000.HV01W24NJR6E23G2C2D7DDBDE730VW';
const clientSecret = 'a0daaa98f245e4a57477499220cf83e86848e0b821';
const redirectUri = 'http://localhost:3000/callback';

app.get('/',(req,res) => {res.send('<h1>Welcome<h1><a href="/auth"> Connect to Zoho Books</a>')});

app.get('/auth', (req,res) => {
    const authorizationURL = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=ZohoBooks.fullaccess.all`;
    res.redirect(authorizationURL);
});

app.get('/callback',async (req,res) => {
    const authorizationCode = req.query.code;

    try{
        console.log("AUTHORIZATION_REQ: ",authorizationCode);
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token',null,{
            params: {
                code: authorizationCode,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }
        });

        const {access_token, refresh_token} = response.data;
        res.send(`Access Token: ${access_token}, Refresh Token: ${refresh_token}`);

    }catch(exception){
        console.log("EXCEPTION_IN_CALLBACK: ",exception);
        res.send(`Error: ${error.response.data}`);
    }
})

app.listen('3000',console.log("SERVER_RUNNING"));