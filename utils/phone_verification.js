import dotenv from 'dotenv';
// import { SID as accountSid, TOKEN as authToken, VERIFICATION_SID } from './config.js'; // Import your configuration values from a separate file
import twilio from 'twilio';

dotenv.config(); // Load environment variables from .env file

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const VERIFICATION_SID = process.env.VERIFICATION_SID

const client = twilio(accountSid, authToken);


/**
 * sendVrifcation - it send verification code to user
 * @to_number : phonNumber to send the message to
 */

export const sendVerification = (to_number) => {
      return new Promise((resolve, reject) => {
        client.verify.v2.services(VERIFICATION_SID)
          .verifications
          .create({ to: to_number, channel: 'sms' })
          .then(verification => {
            resolve(verification.status);
          })
          .catch(err => {
            reject(err);
          });
      });
    };


/**
 * confirmVrifcation - it verifies the code
 * @to_number : phonNumber to send the message to
 * @code : The code send by sendVerification
 */

export const confirmVerification = (code, to_number) => {
      return new Promise((resolve, reject) => {
            client.verify.v2.services(VERIFICATION_SID)
            .verificationChecks
            .create({to: to_number, code: code})
            .then(verification_check => {
                  resolve(verification_check.status);
            })
            .catch(err => {
                  reject(err);  
            });
      });
};
 
 

/**
 * createService - to create a VERIFICATION_SID which is use for token verification
 */
const createService = async () => {
    client.verify.v2.services
                .create({friendlyName: 'My First Verify Service'})
                .then(service => console.log(service.sid));
 };


//  createService()


// module.exports = { confirmVerification, sendVerification};