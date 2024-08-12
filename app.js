const { default: axios } = require('axios');
const express = require('express');
const base64 = require('base-64');
const qs = require('qs');

const app = express();

const clientId = '1FAB3365F7E24CC89541A04B15315F8B';
const clientSecret = 'OMJ7wqrgC_SSVdcXQR3h85dmXpOXXEPLbR96y3HwtrDL3A_C';
const redirectUri = 'https://api.nicesmoke-356782f3.centralindia.azurecontainerapps.io/callback';

let storedRefreshToken = '';
app.get('/health',(req,res)=>{res.status(200).json({msg:"healthy and running !"})})
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Xero Integration</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                body, html {
                    height: 100%;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(120deg, #89f7fe, #66a6ff);
                    color: #fff;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 15px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                h1 {
                    font-size: 3em;
                    margin-bottom: 20px;
                }
                .btn {
                    padding: 10px 20px;
                    font-size: 1.2em;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                    display: inline-block;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
                .icon {
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome</h1>
                <a href="/auth" class="btn">
                    <i class="fas fa-link icon"></i>Integrate to Xero
                </a>
            </div>
        </body>
        </html>
    `);
});

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
