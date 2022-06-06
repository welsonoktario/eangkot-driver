import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { get, post } from "./http";

declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher;

export const createEcho = new Echo({
  broadcaster: "pusher",
  key: process.env.VUE_APP_PUSHER_KEY,
  cluster: process.env.VUE_APP_PUSHER_CLUSTER,
  forceTLS: true,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        post("http://eangkot.test/api/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
          .then((res) => callback(false, res.data))
          .catch((err) => callback(true, err));
      },
    };
  },
});
