import { Http, HttpOptions } from "@capacitor-community/http";
import { Storage } from "@capacitor/storage";
import { keysToCamel, keysToSnake } from "./bodySerializer";

const API_URL = process.env.VUE_APP_API_URL;

export const get = async (endpoint: string) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const headers = {
    Accept: "application/json",
  };

  if (isAPI) {
    const { value } = await Storage.get({ key: "token" });

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
    headers,
  };

  const res = await Http.get(options);
  res.data = keysToCamel(res.data);

  return res;
};

export const post = async (endpoint: string, payload: object) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const isChannel = endpoint.includes("broadcasting");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (isAPI || isChannel) {
    const { value } = await Storage.get({ key: "token" });

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

  const res = await Http.post(options);
  res.data = keysToCamel(res.data);

  return res;
};

export const patch = async (endpoint: string, payload: object) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (isAPI) {
    const { value } = await Storage.get({ key: "token" });

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

  const res = await Http.patch(options);
  res.data = keysToCamel(res.data);

  return res;
};
