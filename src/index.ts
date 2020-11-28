import type { SnowpackPlugin } from "snowpack/lib/index";
import type { Imports } from "./request";
import { transformEsmImports } from "snowpack/lib/rewrite-imports";
import { requestJSON } from "./request";

interface PluginOptions {
  url: string,
  devUrl?: string,
  extensions?: string[]
}

const name = 'snowpack-plugin-remote-import-map'

const plugin = (
  _snowpackConfig: any,
  pluginOptions: PluginOptions,
): SnowpackPlugin => {
  const { url, devUrl, extensions = [".js", ".jsx", ".tsx", ".ts"] } =
    pluginOptions;
  return {
    name,
    async transform({ contents, fileExt, isDev }) {
      contents = contents.toString();
      const remoteImportMapUrl = isDev && devUrl ? devUrl : url;
      let remoteImports: Imports = {};

      try {
        remoteImports = (await requestJSON(remoteImportMapUrl)).imports;
      } catch (e) {
        throw new Error(`${name} failed: ${e.message}`);
      }

      if (extensions.includes(fileExt.toLowerCase())) {
        const replaceImport = (specifier: string) =>
          remoteImports[specifier] || specifier;
        return transformEsmImports(contents, replaceImport);
      }
      return contents;
    },
  };
};

export default plugin;
