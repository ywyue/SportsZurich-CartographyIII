const webpack = require("webpack");
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const cesiumSource = "node_modules/cesium";
const cesiumBuild = "Build/Cesium";

const cesiumOutput = "cesium";

const BUNDLE_SIZE_LIMIT = 5 * 1024 ** 2; // 5 MB

module.exports = {
  publicPath: "./",
  chainWebpack: config => {
    // prevent errors when transpiling cesium core
    config.module.set("unknownContextCritical", false);
    config.module.set(
      "unknownContextRegExp",
      /\/cesium\/Source\/Core\/buildModuleUrl\.js/
    );
    // drop unused debugging code in cesium when building for production
    if (process.env.NODE_ENV === "production") {
      config.module
        .rule("cesium-strip-pragma")
        .test(/\.js$/)
        .pre()
        .include.add(path.resolve(__dirname, cesiumSource))
        .end()
        .sideEffects(false)
        .use("strip-pragma")
        .loader("strip-pragma-loader")
        .options({
          pragmas: {
            debug: false
          }
        });
    }
    // copy cesium assets to bundle and define CESIUM_BASE_URL accordingly
    config.plugin("cesium-copy").use(CopyWebpackPlugin, [
      [
        ...["Workers", "Assets", "Widgets"].map(asset => ({
          from: path.join(cesiumSource, cesiumBuild, asset),
          to: `${cesiumOutput}/${asset}`
        }))
      ]
    ]);
    config
      .plugin("define")
      .use(webpack.DefinePlugin, [
        { CESIUM_BASE_URL: JSON.stringify(`${cesiumOutput}/`) }
      ]);

      config.plugin('provide').use(webpack.ProvidePlugin, [{
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }]);
    // prevent performance warnings from vue
    config.performance
      .maxEntrypointSize(BUNDLE_SIZE_LIMIT * 1024 ** 2)
      .maxAssetSize(BUNDLE_SIZE_LIMIT * 1024 ** 2);
    // optimize splitChunks for cesium alongside other dependencies
    config.optimization.splitChunks({
      cacheGroups: {
        cesium: {
          name: "npm.cesium",
          test: /[\\/]node_modules[\\/]cesium/,
          priority: 10,
          chunks: "all"
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all",
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace("@", "")}`;
          }
        },
        common: {
          name: "app",
          minChunks: 2,
          priority: -20,
          chunks: "initial",
          reuseExistingChunk: true
        }
      }
    });
  }
};
