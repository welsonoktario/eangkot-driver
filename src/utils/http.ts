import { Http, HttpHeaders, HttpOptions } from "@capacitor-community/http";
import { Storage } from "@capacitor/storage";
import { keysToCamel, keysToSnake } from "./bodySerializer";

const API_URL = process.env.VUE_APP_API_URL;

export const get = async (
  endpoint: string,
  headers: HttpHeaders = {
    Accept: "application/json",
  }
) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const url = isAPI ? API_URL + endpoint : endpoint;

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

export const post = async (
  endpoint: string,
  payload: object,
  headers: HttpHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  }
) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const isChannel = endpoint.includes("broadcasting");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);

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

export const patch = async (
  endpoint: string,
  payload: object,
  headers: HttpHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  }
) => {
  const isAPI = !endpoint.includes("http") && !endpoint.includes("auth");
  const url = isAPI ? API_URL + endpoint : endpoint;
  const data = keysToSnake(payload);

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
