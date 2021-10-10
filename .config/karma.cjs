const extensions = [".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx"];
const preprocessors = extensions.reduce(function (memo, ext) {
  memo[`test/**/*${ext}`] = ["webpack", "sourcemap"];
  return memo;
}, {});
const webpack = {
  devtool: "inline-source-map",
  module: {
    rules: [{ test: /\.(ts|tsx)$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions },
};

module.exports = function (config) {
  const pattern = process.argv[process.argv.length - 1];
  config.set({
    basePath: "..",
    frameworks: ["mocha", "webpack"],
    reporters: ["mocha"],
    preprocessors,
    files: [{ pattern: pattern, watched: false }],
    webpack,
    client: { mocha: { timeout: 5000 } },
    colors: true,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
