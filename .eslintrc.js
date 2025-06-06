module.exports = {
    root: true,
    env: {
        es2021: true
    },
    extends: [ "eslint:recommended", "@vue/prettier"],
    rules: {
        "no-console": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
        'prettier/prettier': 0,
    },
};