import { parse } from "url";
import * as http from "http";
import * as https from "https";

export type Imports = {
  [key: string]: string;
};

export type ImportMap = {
  imports: Imports;
};

const method = "GET";
const cache: { [key: string]: ImportMap } = {};

export const requestJSON = (url: string) => {
  const { protocol, hostname, port, path } = parse(url);
  const { request } = protocol === "https" ? https : http;

  if (!cache[url]) {
    return new Promise<ImportMap>((resolve, reject) => {
      const req = request({
        method,
        hostname,
        port,
        path,
      }, (res: any) => {
        let rawData = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: any) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let data;
          try {
            data = JSON.parse(rawData);
            cache[url] = data;
            resolve(data);
          } catch (e) {
            reject(`Failed to parse response from ${url}: ${e}`);
          }
        });
      });
      req.on("error", (err) => {
        reject(err);
      });
      req.end();
    });
  }

  return Promise.resolve(cache[url]);
};
