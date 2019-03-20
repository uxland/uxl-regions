module.exports = api =>{
    api.cache(true);
    const presets= [
        "@babel/preset-env",
        "@babel/preset-typescript"
    ];
    const plugins = [
        "module:fast-async",
        ["@babel/plugin-proposal-decorators", {legacy: true}],
        ["@babel/plugin-proposal-class-properties", {loose: true}],
        "@babel/plugin-syntax-dynamic-import",

    ];
  return{
      env:{
          cjs:{
              presets,
              plugins:[...plugins, ["@babel/plugin-transform-modules-commonjs", {allowTopLevelThis: true}]]
          },
          es:{
              presets,
              plugins
          }
      },
      presets,
      plugins
  };
};