export default {
  content: ["./{src/**/,}*.{js,jsx,ts,tsx,html,svelte,vue}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: "Montserrat, ui-sans-serif, system-ui, sans-serif",
        "league-spartan":
          '"League Spartan", ui-sans-serif, system-ui, sans-serif',
      },
    },
  },
  plugins: [],
  mode: "jit",
};
