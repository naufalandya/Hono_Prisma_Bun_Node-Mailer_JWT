import { Context } from "hono";
import { checkUserByEmail, createUser, getUserByEmail } from "../models/user.model";
import { errorWithStatusCode } from "../middleware/errorHandler";
import { decode, sign, verify } from 'hono/jwt'
import { transporter } from './../config/mailer.config';
import { prisma } from "../config";

const SERVER_EMAIL = String(Bun.env.SERVER_EMAIL)

const SECRET = String(Bun.env.JWT_SECRET)

export const registerUserController = async function(ctx : Context) {
    try {
        const {email, password} = await ctx.req.json()

        const isExist = await checkUserByEmail(email)

        if(isExist) {
            return ctx.json({
                status : false,
                message : `User with email ${email} already exist`
            }, 409)
        }

        const hashed = await Bun.password.hash(password)

        const result = await createUser(email, hashed)

        return ctx.json({
            status : true,
            message : `success`,
            data : result
        }, 201)

    } catch (err) {
        if (err instanceof errorWithStatusCode) {
            return ctx.json({
                status: false,
                message: err.message
            }, err.statusCode);
        }
        
        throw err
    }
} 

export const loginUserControllerByEmail = async function(ctx : Context) {
    try {
        const {email, password} = await ctx.req.json()

        const isExist = await getUserByEmail(email)

        if(!isExist) {
            return ctx.json({
                status : false,
                message : `User with email ${email} is not exist`
            }, 404)
        }

        const verify = await Bun.password.verify(password, isExist.password)

        if(!verify){
            return ctx.json({
                status : false,
                message : 'Password is not match !'
            }, 401)
        }

        const payload = {
            id : isExist.id,
            email : isExist.email,
            password : isExist.password,
            createdAt : isExist.createdAt
        }

        const token = await sign(payload, SECRET)

        return ctx.json({
            status : true,
            message : 'success',
            data : {...payload, token}
        })

    } catch (err) {
        if (err instanceof errorWithStatusCode) {
            return ctx.json({
                status: false,
                message: err.message
            }, err.statusCode);
        }
        
        throw err
    }
}

export const whoAmIController = async function(ctx : Context) {

    try {
        const { authorization } = ctx.req.header()

        if (!authorization || !authorization.split(' ')[1]) {
            return ctx.json({
                status: false,
                message: 'token not provided!',
                data: null
            }, 401);
        }

        let token = authorization.split(' ')[1];

        const decodedPayload = await verify(token, SECRET)

        return ctx.json({
            status : true,
            message : 'success',
            data : decodedPayload
        })

    } catch (err) {
        throw err
    }
}

const randomVerification = async function(length : number){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const verifyEmailAndGiveToken = async function(ctx : Context) {

    try {
        const {email} = await ctx.req.json()

        const isExist = await getUserByEmail(email)
    
        const token = await randomVerification(8)
    
        const staticToken = await prisma.user.update({
            where : {
                id : isExist.id
            }, 

            data : {
                verificationToken : token
            }
        })

        const data = await transporter.sendMail({
            from: SERVER_EMAIL,
            to: "andyakuliah@gmail.com", //`${email}`
            subject: "Email Verification",
            text: `Please dont send it to anyone, ${staticToken.verificationToken}`,
        })

        return ctx.json({
            status : true,
            message : "We sent token verification to your email !",
            data : data
        })

    } catch (err) {
        if (err instanceof errorWithStatusCode) {
            return ctx.json({
                status: false,
                message: err.message
            }, err.statusCode);
        }
        
        throw err
    }
}

export const verifyTokenAndLogin = async function(ctx : Context) {
    const { email, inputToken } = await ctx.req.json()

    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if(!user) {
        return ctx.json({
            status : false,
            message : `User with email ${email} is not exist`,
        }, 401)
    }


    if (inputToken !== user?.verificationToken) {
        return ctx.json({
            status : false,
            message : 'Token provided is not valid'
        }, 401)
    }


    await prisma.user.update({
        where : {
            email : email
        },

        data : {
            verificationToken : null
        }
    })

    const payload = {
        id : user?.id,
        email : user?.email,
        createdAt : user?.createdAt
    }

    const token = await sign(payload, SECRET)

    return ctx.json({
        status : true,
        message : 'success',
        data : {...payload, token}
    })
}

type UserPayload = {
    id : string,
    email : string,
    createdAt : Date
}

export const updateYourPassword = async function(ctx : Context) {
    try {
    
            const { authorization } = ctx.req.header()
            const { password } = await ctx.req.json()
    
            if (!authorization || !authorization.split(' ')[1]) {
                return ctx.json({
                    status: false,
                    message: 'token not provided!',
                    data: null
                }, 401);
            }

            if(!password){
                return ctx.json({
                    status: false,
                    message: 'Please insert password !',
                }, 401);
            }
    
            let token = authorization.split(' ')[1];
    
            const user : UserPayload = await verify(token, SECRET)

            const result = await prisma.user.update({
                where : {
                    id : Number(user.id)
                }, data : {
                    password : password
                }
            })

            if(!result) {
                return ctx.json({
                    status : false,
                    message : `User with email ${user.email} is not exist`
                })
            }
    
            return ctx.json({
                status : true,
                message : 'success',
                data : result
            })
    
    } catch (err) {
        throw err
    }
}



