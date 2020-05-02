const connection = require('../database/connection')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
require('dotenv').config()

const oauth2Client =  new  OAuth2 ( 
    process.env.CLIENT_ID, // Client ID
    process.env.CLIENT_SECRET, // Client Secret 
    'https://developers.google.com/oauthplayground' // 
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
}); 
const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: process.env.USER, 
         clientId: process.env.CLIENT_ID,
         clientSecret: process.env.CLIENT_SECRET,
         refreshToken: process.env.REFRESH_TOKEN,
         accessToken: accessToken
    }
});




module.exports = {
    async index (request, response){
        const { email } = request.body;
    
        const escola = await connection('escola')
        .where('email', email)
        .select('*')
        .first();
        
        if (!escola) {
            return response.status(400).json({ error : 'This email is not longer valid'});
        }
        const mailOptions = {
            from: process.env.USER,
            to: `${email}`,
            subject: 'Recuperação de senha - Grade Escolar',
            generateTextFromHTML: true,
            html: `<p>Olá, segue sua senha:<strong> ${escola.senha}</strong></p>`
        };

        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            transporter.close();
       });
    
        return response.json(escola)
    }
}


