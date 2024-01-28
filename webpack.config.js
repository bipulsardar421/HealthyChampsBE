const nodeExternals = require("webpack-node-externals");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin")

module.exports = (env, argv) => {
  return {
    entry: { app: "./src/main.ts" },
    externalsPresets: { node: true },
    context: __dirname,
    target: "async-node",
    externals: [nodeExternals()],
    //  externals: ["pg-hstore", "rmcast", nodeWindowsServiceExternals],
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "mindchamps-api.js",
      pathinfo: false
    },
    optimization: {
      // splitChunks: {
      //   chunks: 'all',
      // }
      minimize: true,
      minimizer: [new TerserPlugin({
        // sourceMap: true,
        extractComments: true,
        terserOptions: {
          ecma: 8,
          warnings: false,
          keep_fnames: true,
        }
      })]
    },
    devtool: "source-map",
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/upload/**' },
          { from: "package.json" },
          { from: "package-lock.json" },
          { from: "env/default.json" },
          { from: `env/${env.APP_ENV}.json` },
          // { from: 'src/assets_firebase/**.json' },
          // { from: 'src/assets_firebase/**.js' },
          {
            from: 'src/swagger-docs/**.json', to({ context, absoluteFilename }) {
              return Promise.resolve("swagger-docs/[name][ext]");
            }, noErrorOnMissing: true
          },
          // {
          //   from: 'src/assets_firebase/mindchamp-notification-firebase-adminsdk-xap53-e5005e43c2.json',
          //   to: 'assets_firebase/[name][ext]',
          //   noErrorOnMissing: true,
          // },
          
          {
            from: 'src/assets_firebase/firebaseInit.js', 
            to: 'assets_firebase/[name][ext]',
            noErrorOnMissing: true,
          }          
        ],
      }),
      new webpack.DefinePlugin({
        "process.env.APP_ENV": JSON.stringify(env.APP_ENV),
      }),
    ],
    node: {
      __dirname: false,
    },
    resolve: {
      extensions: [".ts", ".js", ".json"],
    },
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.(json)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]'
              }
            }
          ],

          exclude: /node_modules/,

        },
        {
          test: /\.(ts)$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /pdf_viewer/],
        },
        {
          test: /\.node$/,
          loader: "native-ext-loader"
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
          exclude: path.resolve(__dirname, '../src/upload/recipe/images'),
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }]
        }
      ],
    },
  };
};

function nodeWindowsServiceExternals({ context, request }, arg3) {
  // var context = opts.arg1;
  // var request = opts.arg2;
  var callback = arg3;

  var importType = "commonjs";

  if (context.indexOf("\\node-windows\\") > 0) {
    if (request.substr(0, 2) === "./") {
      request = `./data/node-windows/lib/${request.substr(2)}`
    }
    return callback(null, importType + ' ' + request);
  } else if (request.indexOf("node-windows") >= 0) {
    return callback(null, importType + ' ' + request);
  } else {
    return callback();
  }
}