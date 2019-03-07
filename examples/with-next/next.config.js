const path = require("path");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const exportPathMap = require("./routes").exportPathMap;

module.exports = {
  webpack: (config, { buildId, dev }) => {
    config.module.rules.push({
      test: /\.((sa|sc|c)ss|jpg|png)$/,
      use: [
        {
          loader: "emit-file-loader",
          options: {
            name: "dist/[path][name].[ext]"
          }
        }
      ]
    });

    config.module.rules.push({
      test: /\.(jpg|png|svg)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: ".static/assets/[hash].[ext]",
            outputPath: dev ? path.join(__dirname, "/") : undefined,
            publicPath: function(url) {
              return url.replace(/^.*.static/, "/static");
            }
          }
        }
      ]
    });

    if (!dev) {
      /**
       * Optimize css in production mode
       */
      if (!Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer = [];
      }
      config.optimization.minimizer.push(
        new OptimizeCssAssetsWebpackPlugin({
          cssProcessorOptions: {
            discardComments: { removeAll: true }
          }
        })
      );
    }

    config.module.rules.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        "babel-loader",
        {
          loader: "css-loader",
          options: {
            url: true,
            sourceMap: dev,
            importLoaders: 2
          }
        },
        {
          loader: "postcss-loader",
          options: {
            plugins: [
              require("autoprefixer")({
                /* options */
              })
            ]
          }
        },
        {
          loader: "sass-loader"
        }
      ]
    });

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: dev
          ? "static/chunks/[name].css"
          : "static/chunks/[name].[contenthash:8].css",
        chunkFilename: dev
          ? "static/chunks/[name].chunk.css"
          : "static/chunks/[name].[contenthash:8].chunk.css",
        hot: dev
      })
    );

    return config;
  },
  useFileSystemPublicRoutes: false,
  exportPathMap
};
