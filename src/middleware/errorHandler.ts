import { StatusCode } from "hono/utils/http-status";

export class errorWithStatusCode extends Error {
    public statusCode: StatusCode;

    constructor(message: string, statusCode: StatusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}