const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy, disableEsLint  } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@layout-trigger-background': '#ffffff',
            '@layout-trigger-color': '#000000',
            '@menu-item-color': '#5d6a35',
            '@menu-highlight-color': '#5d6a35'
        },
    }),
    addDecoratorsLegacy(),
    disableEsLint()
);