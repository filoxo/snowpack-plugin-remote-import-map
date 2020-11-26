import * as url from "url";
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

export const requestJSON = (pathToSpec: string) => {
  const { protocol, hostname, port, path } = url.parse(pathToSpec);
  const { request } = protocol === "https" ? https : http;

  if (!cache[pathToSpec]) {
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
          const data = JSON.parse(rawData);
          cache[pathToSpec] = data;
          resolve(data);
        });
      });
      req.on("error", (err) => {
        reject(err);
      });
      req.end();
    });
  }

  return Promise.resolve(cache[pathToSpec]);
};
