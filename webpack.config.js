const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
console.log(process.env.NODE_ENV);
module.exports = {
    mode: process.env.NODE_ENV,
    devtool: process.env.SOURCE_MAP,
    entry: './main.js', // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js' // 出口文件
    },
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, 'src/'),
            "@assets": path.resolve(__dirname, 'src/assets/')
        },
    },
    // 使用loader处理非js文件, 让webpack可以处理这些文件
    module: {
        /*          
         * test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
         * use 属性，表示进行转换时，应该使用哪个 loader。
         */
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除 node_modules 目录
            },
            /*
             * style-loader 动态创建 style 标签，将 css 插入到 head 中.
             * css-loader 负责处理 @import 等语句。
             * postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
             * less-loader 负责处理编译 .less 文件,将其转为 css
            */
            {
                test: /\.(le|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    // options: {
                    //     plugins: function() {
                    //         return [
                    //             require('autoprefixer')({
                    //                 "overrideBrowserslist": [
                    //                     ">0.25%",
                    //                     "not dead"
                    //                 ]
                    //             })
                    //         ]
                    //     }
                    // }
                }, 'less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false,
                            name: '[name]_[hash:8].[ext]',
                            outputPath: 'img/' // 图片输出文件夹
                        }
                    }
                ],
                exclude: /node_modules/
            },
            // 处理html里面的src地址
            {
                test: /.html$/,
                use: 'html-withimg-loader'
            }
        ]
    },
    // plugins用于执行范围更广的任务,从打包优化和压缩，一直到重新定义环境中的变量
    // 插件目的在于解决 loader 无法实现的其他事。
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' //个人习惯将css文件放在单独目录下
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            // hash: true //是否加上hash，默认是 false
        })
    ],
    devServer: {
        port: '8080', //默认是8080
        quiet: false, //默认不启用
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用
        clientLogLevel: "silent", //日志等级
        compress: true //是否启用 gzip 压缩
    }
}