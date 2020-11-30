import { parse } from "url";
import * as http from "http";
import * as https from "https";

export type Imports = {
  [key: string]: string;
};

export type ImportMap = {
  imports: Imports;
};

const cache: { [key: string]: ImportMap } = {};

type RequestJSONOptions = {
  strict?: boolean;
};

export const requestJSON = (url: string, options: RequestJSONOptions = {}) => {
  const { strict = false } = options;
  const { get } = parse(url).protocol === "https" ? https : http;

  if (!cache[url]) {
    return new Promise<ImportMap>((resolve, reject) => {
      const req = get(url, (res) => {
        const contentType = res.headers["content-type"] || "";
        const hasValidMIMEtype = strict &&
          /^application\/importmap\+json/.test(contentType);
        if (!strict || hasValidMIMEtype) {
          let rawData = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
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
        } else {
          reject(
            `Response content-type from ${url} should be 'application/importmap+json' but was instead ${contentType}`,
          );
        }
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  return Promise.resolve(cache[url]);
};
