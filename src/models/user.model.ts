import { prisma } from "../config/index"
import { errorWithStatusCode } from './../middleware/errorHandler';

export const getUsers = async function(): Promise<object>{
    try {
        return await prisma.user.findMany()
    } catch (err){
        throw err
    }
}

export const getUserById = async function(id : number) : Promise<object>{
    try {
        const result = await prisma.user.findUnique({
            where : {
                id : id
            }
        })

        if(!result) {
            throw new errorWithStatusCode(`User with id ${id} is not exist`, 404)
        }

        return result
    } catch (err) {
        throw err
    }
}


type UserCreateType = {
    id : number,
    email : string,
    password : string,
    createdAt : Date
}

export const getUserByEmail = async function(email : string) : Promise<UserCreateType>{
    try {
        const isExist = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(!isExist) {
            throw new errorWithStatusCode(`User with email ${email} is not exist`, 404)
        }

        return isExist

    } catch (err) {
        throw err
    }
}

export const checkUserByEmail = async function(email : string) : Promise<boolean>{
    try {
        const isExist = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(isExist) {
            return true
        }

        return false

    } catch (err) {
        throw err
    }
}


export const checkUserByUsername = async function(username : string) : Promise<boolean>{
    try {
        const isExist = await prisma.user.findUnique({
            where : {
                username : username
            }
        })

        if(isExist) {
            return true
        }

        return false

    } catch (err) {
        throw err
    }
}



export const checkUserById = async function(id : number) : Promise<boolean>{
    try {
        const result = await prisma.user.findUnique({
            where : {
                id : id
            }
        })

        if(!result) {
            throw new errorWithStatusCode(`User with id ${id} is not exist`, 404)
        }

        return true
    } catch (err) {
        throw err
    }
}

export const createUser = async function(email : string, password : string) : Promise<object> {
    try {
        const result = await prisma.user.create({
            data : {
                email : email,
                password : password,
                createdAt : new Date()
            }
        })

        return result
    } catch (err) {
        throw err
    }
}

