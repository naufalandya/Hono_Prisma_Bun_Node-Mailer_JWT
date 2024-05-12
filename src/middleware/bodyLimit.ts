import { bodyLimit } from "hono/body-limit";

export const limit1KiloByte = bodyLimit({
    maxSize: 1 * 1024, //1kb
    onError: (c) => {
      return c.json({ message : 'overflow :('}, 413)
    },
})

export const limit5KiloByte = bodyLimit({
    maxSize: 1 * 1024, //5kb
    onError: (c) => {
      return c.json({ message : 'overflow :('}, 413)
    },
})