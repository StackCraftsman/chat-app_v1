import ElasticEmail from '@elasticemail/elasticemail-client';
import { Configuration, EmailsApi } from '@elasticemail/elasticemail-client-ts-axios';
import dotenv  from 'dotenv';
// var ElasticEmail = require('@elasticemail/elasticemail-client');
dotenv.config(); 



export const sendEmail = async (email_to, subject,  body) => { 
    
    const config = new Configuration({
        apiKey: process.env.API_KEY
     });
     const emailsApi = new EmailsApi(config);
     const emailTransactionalMessageData = {
         Recipients: { 
           To: [email_to] // maximum 50 recipients
         },
         Content: {
           Body: [
             {
               ContentType: "HTML",
               Charset: "utf-8",
               Content: body
             }
           ],
           From: "angelamongstangels@gmail.com",
           Subject: subject
         }
     }; // interface EmailTransactionalMessageData from '@elasticemail/elasticemail-client-ts-axios'
     const sendTransactionalEmails = (EmailTransactionalMessageData) => {
       emailsApi.emailsTransactionalPost(emailTransactionalMessageData).then((response) => {
           console.log('API called successfully.');
           console.log(response.data);
       }).catch((error) => {
           console.error(error);
       });
     };
     sendTransactionalEmails(emailTransactionalMessageData);

};






