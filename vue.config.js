const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: "/mars-dc-dm",
    outputDir: 'dist_project',
    lintOnSave: true,
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@style/common.scss";'
            }
        }
    },
    productionSourceMap: false, //发布去掉sourceMap，泄露源代码
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@api', resolve('src/api/modules'))
            .set('@img', resolve('src/static/img'))
            .set('@router', resolve('src/routers/module'))
            .set('@utils', resolve('src/utils'))
            .set('@c', resolve('src/components'))
            .set('@pages', resolve('src/pages'))
            .set('@style', resolve('src/static/style'));
    },
    configureWebpack: config => {
        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'axios': 'axios',
            // 'echarts': 'echarts',
            // 'macarons': 'macarons',
            // 'china': 'china'
            // 'element-ui': 'element-ui'
        }
    }
};