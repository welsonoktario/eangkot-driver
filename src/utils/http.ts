import { Http, HttpOptions } from "@capacitor-community/http";
import { Preferences } from "@capacitor/preferences";
import { keysToSnake } from "./bodySerializer";

const API_URL = process.env.VUE_APP_API_URL;

export const get = async (endpoint: string) => {
  const isAPI = !endpoint.includes("http");
  const url = isAPI ? API_URL + endpoint : endpoint;
  let headers: { Authorization: string };

  if (isAPI) {
    const { value } = await Preferences.get({ key: "token" });

    headers = Object.assign(
      {},
      !value && value === "null"
        ? null
        : {
            Authorization: `Bearer ${value}`,
          }
    );
  }

  const options: HttpOptions = {
    url,
    headers,
  };

  return await Http.get(options);
};

export const post = async (endpoint: string, payload: object) => {
  const isAPI = !endpoint.includes("http");
  const isChannel = endpoint.includes("broadcasting");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (isAPI || isChannel) {
    const { value } = await Preferences.get({ key: "token" });

    Object.assign(
      headers,
      !value && value === "null"
        ? null
        : {
            Authorization: `Bearer ${value}`,
          }
    );
  }

  const options: HttpOptions = {
    url,
    data,
    headers,
  };

  return await Http.post(options);
};

export const patch = async (endpoint: string, payload: object) => {
  const isAPI = !endpoint.includes("http");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (isAPI) {
    const { value } = await Preferences.get({ key: "token" });

    Object.assign(
      headers,
      !value && value === "null"
        ? null
        : {
            Authorization: `Bearer ${value}`,
          }
    );
  }

  const options: HttpOptions = {
    url,
    data,
    headers,
  };

  return await Http.patch(options);
};
