import userModel from "../model/user.model.js";
import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt";
import generate_jwt from "../utils/auth_middleWare.js";
import { sendVerification, confirmVerification } from "../utils/phone_verification.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/email.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from 'mongoose';
import dotenv  from 'dotenv';

dotenv.config(); 


// middleware to verify the 

export const verifyUser = asyncHandler(async (req, res) => {
    try { 
        const { email } = req.method === "GET" ? req.query : req.body; 

        //check user existance
        let exist = await userModel.findOne({ email });
        if(!exist) return res.status(404).send({ error: "Cannot find user" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication error" });
    }
});


export const emailRegister = asyncHandler(async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        // phoneNumber,
        password,
        confirmPassword,
        address,
        website,
        nickname,
        country,
        city,
        gender,
        relationshipstatus,
        education,
        job,
        purpose,
        interest,
        dateOfBirth: { year, month, date },
        aboutyourself,
        coverPhoto,
        profilePhoto,
      } = req.body;
  
      // Check the existing user
      const existEmail = userModel.findOne({ email: email });
      const existNickname = userModel.findOne({ nickname: nickname });
      // const existPhoneNumber = userModel.findOne({ phoneNumber: phoneNumber });
      const existWebsite = userModel.findOne({ website: website });
  
      // Password and confirm password
      if (password !== confirmPassword) {
        return res.status(400).send({ error: "Passwords do not match" });
      }
  
      const [emailResult, nicknameResult,  websiteResult] = await Promise.all([
        existEmail,
        existNickname,
        // existPhoneNumber,
        existWebsite,
      ]);
  
      if (emailResult) {
        return res.status(400).send({ error: "Email already exists" });
      }
  
      if (nicknameResult) {
        return res.status(400).send({ error: "Nickname already exists, please choose another one" });
      }
  
      // if (phoneResult) {
      //   return res.status(400).send({ error: "Phone Number already exists, please choose another one" });
      // }
  
      if (websiteResult) {
        return res.status(400).send({ error: "Website already exists, please choose another one" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
	  const verifiedWith = email;
    const phoneNumber = email
      const user = new userModel({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        address,
        website,
        nickname,
        country,
        city,
        gender,
        relationshipstatus,
        education,
        job,
        purpose,
        interest,
        dateOfBirth: { year, month, date },
        aboutyourself,
        coverPhoto,
        profilePhoto,
		verifiedWith
      });
  
      // Return save result as a response
      const result = await user.save();
      const random_num = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
	  console.log(random_num);

    const sent = await sendEmail(email, 'Two Factor Authentification', `Your verification code is \n ${random_num}`);
      res.status(201).send({ msg: "User Created Successfully" , token: generate_jwt({email: email, id: result._id.toString(), code: random_num}, '1h')});
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: "Please Try again, Internal error",
      });
    }
});



export const phoneRegister = asyncHandler(async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        password,
        address,
        website,
        nickname,
        country,
        confirmPassword,
        city,
        gender,
        relationshipstatus,
        education,
        job,
        purpose,
        interest,
        dateOfBirth: { year, month, date },
        aboutyourself,
        coverPhoto,
        profilePhoto,
      } = req.body;
  
      // // Check the existing user
      // const existEmail = userModel.findOne({ email: email });
      const existNickname = userModel.findOne({ nickname: nickname });
      const existPhoneNumber = userModel.findOne({ phoneNumber: phoneNumber });
      const existWebsite = userModel.findOne({ website: website });
  
      // Password and confirm password
      if (password !== confirmPassword) {
        return res.status(400).send({ error: "Passwords do not match" });
      }
  
      const [ nicknameResult, phoneResult, websiteResult] = await Promise.all([
        // existEmail,
        existNickname,
        existPhoneNumber,
        existWebsite,
      ]);
  
	
      // if (emailResult) {
      //   return res.status(400).send({ error: "Email already exists" });
      // }
  
      if (nicknameResult) {
        return res.status(400).send({ error: "Nickname already exists, please choose another one" });
      }
  
      if (phoneResult) {
        return res.status(400).send({ error: "Phone Number already exists, please choose another one" });
      }
  
      if (websiteResult) {
        return res.status(400).send({ error: "Website already exists, please choose another one" });
      }

      const email = phoneNumber
  
      const hashedPassword = await bcrypt.hash(password, 10);
	    const verifiedWith = phoneNumber;

      const user = new userModel({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        address,
        website,
        nickname,
        country,
        city,
        gender,
        relationshipstatus,
        education,
        job,
        purpose,
        interest,
        dateOfBirth: { year, month, date },
        aboutyourself,
        coverPhoto,
        profilePhoto,
		    verifiedWith
      });
  
      // Return save result as a response
      const result = await user.save();
      const status = await sendVerification(phoneNumber);
      res.status(201).send({ msg: "User Created Successfully Check Your phone Number for OTP Code" , token: generate_jwt({email: email, id: result._id.toString(), phoneNumber: phoneNumber}, '5m')});
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: "Please Try again, Internal error",
      });
    }
});




// Function to delete all user records
// const deleteAllUsers = async () => {
//   try {
//     // Use Mongoose to delete all records in the userModel collection
//     const deleteResult = await userModel.deleteMany({});

//     console.log(`Deleted ${deleteResult.deletedCount} user records.`);
//   } catch (error) {
//     console.error('Error deleting user records:', error);
//   }
// };

// // Call the function to delete all user records
// deleteAllUsers();

// const getAllUsers = async () => {
//   try {
//     // Use Mongoose to find all records in the userModel collection
//     const users = await userModel.find({});

//     console.log(`Found ${users.length} user records.`);
//     console.log(users);
//   } catch (error) {
//     console.error('Error getting user records:', error);
//   }
// };

// // Call the function to get all user records
// getAllUsers();






/**
 * resend_phone_2FA - For two factor authentification
 */
export const resend_phone_2FA = asyncHandler(async (req, res) => {
    try {
        // Get token from headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(decode)
        const status = await sendVerification(decode.user.phoneNumber);

        // Send otp to user
        if (status == 'pending') {
            return res.status(200).json({two_FA: true, message: "check for verification code on your phone", access_token: generate_jwt({code: "code", id: decode.user.id, phoneNumber: decode.user.phoneNumber}, "5m")});
        } else {
            return res.status(500).json({error: "Unable to send verification code"})
        };

    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            res.status(400).json({error: "code Expired Please Try login again"});
        }
        res.status(401).json({error: "Unauthorize"});
    };
});



/**
 * verify_phone_login_2FA - it verify otp
 * @code : the otp code
 * @phoneNumber : the phone number to verify
 */

export const verify_phone_login_2FA = asyncHandler(async (req, res) => {
    // Check if token is present in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from headers
            const token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
         
            // Convert the userId to an ObjectId
            // console.log(decode.user.id)
            const id = mongoose.Types.ObjectId(decode.user.id);
           console.log(decode.user.phoneNumber, req.body.code)
            const status = await confirmVerification(req.body.code, decode.user.phoneNumber);
         
            // Verify otp
        
            console.log(status)
            if (status == 'approved') {
                const user = await userModel.findOneAndUpdate(
                  { _id: id }, // Match the user by their ObjectId
                  { $set: {isVerified: true} },
                  { new: true } // Return the updated document
                );
                if (!user) return res.status(401).json({error: "Invalid Credentails"});
                return res.status(200).json({success: "token sent", access_token: generate_jwt({id: decode.user.id}, "5h"), user_id: decode.user.id});
            }
            else {
                return res.status(409).json({error: "Invalid otp/Unable to verify code"});
            };
        } catch (error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                res.status(400).json({error: "code Expired Please Try login again"});
            }
            res.status(401).json({error: "Unauthorize"});
        };
    } else {
        res.status(401).json({error: "Unauthorize"})
    };
    
});


/**
 * resend_2FA - For two factor authentification
 */
export const resend_2FA = asyncHandler(async (req, res) => {
    try {
        // Get token from headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode.user.code == undefined || decode.user.email == undefined) {
            return res.status(401).json({error: "Unauthorize"})
        };

        // send verification email
        const random_num = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        const sent = await sendEmail(decode.user.email, 'Two Factor Authentification', `Your verification code is \n ${random_num}`);

        return res.status(200).json({two_FA: true, message: "An OTP code is sent to your account please verify", access_token: generate_jwt({code: random_num, id: decode.user.id, email: decode.user.email}, "5m")});

    } catch (error) {
        console.log(error)
       return  res.status(401).json({error: "Session Expired, Try login again"});
    };
});



/**
 * verify_2FA - For two factor authentification
 * @code_2fa - two factor code
 */

export const verify_2FA = asyncHandler(async (req, res, next)=> {
    // Check if token is present in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from headers
            const token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode.user.code)
            if (decode.user.code == undefined || decode.user.email == undefined) {
                return res.status(401).json({error: "Unauthorize"})
            };

            const id = mongoose.Types.ObjectId(decode.user.id);

            if (decode.user.code == req.body.code) {
              console.log(id)
              const user = await userModel.findOneAndUpdate(
                { _id: id }, // Match the user by their ObjectId
                { $set: {isVerified: true} },
                { new: true } // Return the updated document
              );
              return res.status(200).json({success: "token sent", access_token: generate_jwt({id: decode.user.id}, "5h"), id: decode.user.id});
            }
            return res.status(401).json({error: "Invalid otp code"})
        } catch (error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                res.status(400).json({error: "code Expired Please Try login again"});
            }
            res.status(401).json({error: "Unauthorize"});
        };
    } else {
        res.status(401).json({error: "Unauthorize"})
    }
});


/**
 * auth_passport - for passport authentication using google
 */


export const auth_passport = passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/v1/user/auth/google-redirect",
  },
  function(accessToken, refreshToken, profile, cb) {
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const id = profile.id;

    return cb(firstName, lastName);
  }
  ));


  /**
   * 
   */

  export const passport_callback = asyncHandler(async (req, res) => {
    return res.status.json({ req });
  });
