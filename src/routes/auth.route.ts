import { Hono } from "hono";
import { userController } from "../controllers";
import { bodyLimiter, routeValidator } from "../middleware";

const auth = new Hono()
    .post("/register", bodyLimiter.limit1KiloByte, routeValidator.authValidator ,(ctx) => userController.registerUserController(ctx))
    .post("/login", bodyLimiter.limit1KiloByte, routeValidator.authValidator, (ctx) => userController.loginUserControllerByEmail(ctx))
    .post("/who-am-i", bodyLimiter.limit1KiloByte, (ctx) => userController.whoAmIController(ctx))
    .post("/forgot-password-send-email-token", bodyLimiter.limit5KiloByte, routeValidator.emailValidator, (ctx) => userController.verifyEmailAndGiveToken(ctx))
    .post("/forgot-password-send-email-token/verify", bodyLimiter.limit5KiloByte, routeValidator.tokenValidator, (ctx) => userController.verifyTokenAndLogin(ctx))
    .post("/update-password", bodyLimiter.limit1KiloByte, (ctx) => userController.updateYourPassword(ctx))

export default auth