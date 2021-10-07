const sharedPresets = ["@babel/typescript"];
const shared = {
  ignore: ["src/**/*.spec.ts"],
  presets: sharedPresets,
};

export default {
  env: {
    esm: {
      ...shared,
      presets: [
        [
          "@babel/env",
          {
            modules: "auto",
            targets: { node: "current" },
          },
        ],
        ...sharedPresets,
      ],
    },
    cjs: {
      ...shared,
      presets: [
        [
          "@babel/env",
          {
            modules: false,
            targets: { node: "10" },
          },
        ],
        ...sharedPresets,
      ],
    },
    umd: {
      ...shared,
      presets: [
        [
          "@babel/env",
          {
            targets: "> 0.25%, not dead",
          },
        ],
        ...sharedPresets,
      ],
    },
    test: {
      presets: ["@babel/env", ...sharedPresets],
    },
  },
};
