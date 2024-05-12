import { Hono } from "hono";
import { authRoute } from "../routes";

const v1 = new Hono().basePath("/v1")

v1.route("/auth", authRoute)

export default v1