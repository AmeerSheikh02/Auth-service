
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user : {
    id: string,
    email : string
}) =>{
    return jwt.sign(
        {
            userId : user.id,
            email : user.email
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn : '15m',
        }
    );
};

export const generateRefreshToken = (user : {
    id : string,
    email : string,
}) => {
    return jwt.sign(
        {
            userId : user.id,
            email : user.email,
        },
        process.env.REFRESH_SECRET as string,
        {
            expiresIn : "7d",
        }
    )
}