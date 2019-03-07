const path = require("path");
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
          ? "static/chunks/index.css"
          : "static/chunks/" + buildId + ".css",
        allChunks: true
      })
    );

    return config;
  },
  useFileSystemPublicRoutes: false,
  exportPathMap
};
