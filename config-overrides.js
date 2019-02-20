const {
    override,
    fixBabelImports,
} = require('customize-cra');

module.exports = {
    webpack: override(
        // customize-cra plugins here
        fixBabelImports("import", {
            libraryName: "antd", libraryDirectory: "es", style: 'css' // change importing css to less
        }),
        (config) => {
            // 去掉 source-map
            config.devtool = false;
            return config;
        },
    )
}