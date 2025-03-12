import { FJ } from "@firejet/cli";

const config: FJ.FireJetConfig = {
  groups: {
    default: {
      components: {},
      globalCss: ["./styles.css"],
      postcssPath: "./postcss.config.js",
    },
  },
};

export default config;
