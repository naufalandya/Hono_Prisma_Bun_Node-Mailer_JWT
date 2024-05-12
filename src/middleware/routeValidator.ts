import { zValidator } from "@hono/zod-validator";
import { z } from 'zod'

export const authValidator = zValidator(
    'json', z.object({
        email : z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
          }).max(150).email({
            message: "Invalid email address"
          }),
        password : z.string().min(8, {
            message: "Must be 8 or more characters long"
        }).max(100)
    }), (result, c) => {
        if(!result.success){
            return c.json({
                error : {
                    status: false,
                    message: result.error
                }
            }, 400)
        }
    }
)

export const emailValidator = zValidator(
    'json', z.object({
        email : z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
          }).max(150).email({
            message: "Invalid email address"
          }),
    }), (result, c) => {
        if(!result.success){
            return c.json({
                error : {
                    status: false,
                    message: result.error
                }
            }, 400)
        }
    }
)

export const tokenValidator = zValidator(
    'json', z.object({
        email : z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
          }).max(150).email({
            message: "Invalid email address"
          }),
        inputToken : z.string({
            required_error: "input token is required",
            invalid_type_error: "token must be a string",
          }).length(8)
    }), (result, c) => {
        if(!result.success){
            return c.json({
                error : {
                    status: false,
                    message: result.error
                }
            }, 400)
        }
    }
)

