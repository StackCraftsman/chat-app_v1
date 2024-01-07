import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
dotenv.config(); 

/**
 * generate_jwt - it generate jwt webtoken for login
 * @user : payload 
 * @time : the time the jwt will expires defualt is one hour
 * @returns : the jwt token
 */


const generate_jwt = (user, duration) => {
    const token = jwt.sign( {user}, process.env.JWT_SECRET,
                            {expiresIn: duration});

    return token;
};

export default generate_jwt;