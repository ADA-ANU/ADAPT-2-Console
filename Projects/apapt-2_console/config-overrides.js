// const { override, fixBabelImports, addLessLoader } = require('customize-cra');
//
// module.exports = override(
//     fixBabelImports('import', {
//         libraryName: 'antd',
//         libraryDirectory: 'es',
//         style: true,
//     }),
//     addLessLoader({
//         javascriptEnabled: true,
//         modifyVars: {
//             '@layout-trigger-background': '#ffffff',
//             '@layout-trigger-color': '#000000'
//         },
//     }),
// );
const { override, addDecoratorsLegacy } = require('customize-cra');
module.exports = override(
    addDecoratorsLegacy()
);