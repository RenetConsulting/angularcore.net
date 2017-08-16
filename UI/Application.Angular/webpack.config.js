/*
In the DOS prompt run:
	webpack
*/
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AotPlugin;

const extractCSSBase = new ExtractTextPlugin({
    filename: 'base-styles.css',
    allChunks: true
});
const extractCSSMain = new ExtractTextPlugin({
    filename: 'main-styles.css',
    allChunks: true
});
const autoprefixerPlugin = autoprefixer({
    browsers: 'last 5 versions'
});
const devCSSLoaders = [
    'css-loader',
    { loader: 'postcss-loader', options: { plugins: [autoprefixerPlugin] } }
];
const prodCSSLoaders = [
    { loader: 'css-loader', options: { minimize: true, } },
    { loader: 'postcss-loader', options: { plugins: [autoprefixerPlugin] } }
];

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                //{ test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
                { test: /\.ts$/, include: /ClientApp/, use: isDevBuild ? ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] : '@ngtools/webpack' },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.css$/, include: [/components/], use: ['to-string-loader'].concat((isDevBuild) ? devCSSLoaders : prodCSSLoaders) },
                {
                    test: /\.css$/,
                    exclude: [/main-styles.css$/, /components/],
                    use: ['to-string-loader'].concat(extractCSSBase.extract({
                        use: [].concat((isDevBuild) ? devCSSLoaders : prodCSSLoaders)
                    }))
                },
                {
                    test: /\.css$/,
                    include: [/main-styles.css$/],
                    exclude: [/components/],
                    use: ['to-string-loader'].concat(extractCSSMain.extract({
                        use: [].concat((isDevBuild) ? devCSSLoaders : prodCSSLoaders)
                    }))
                },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'null-loader' } // put png|jpg|jpeg|gif|svg to wwwroot
            ]
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(), // webpack 3
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'isDevelopment': JSON.stringify(isDevBuild),
                'VERSION': JSON.stringify(new Date().toISOString()),
            }),
            new CheckerPlugin(),
            extractCSSMain,
            extractCSSBase

        ].concat(isDevBuild ? [] : [
            new UglifyjsWebpackPlugin()
        ])
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: { 'main-client': './ClientApp/boot-client.ts' },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                new AotPlugin({
                    tsConfigPath: './tsconfig.aot.json',
                    entryModule: path.join(__dirname, 'ClientApp/app/app.module.client#AppModuleBrowser'),
                    exclude: ['./**/*.server.ts']
                })
            ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig, {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './ClientApp/boot-server.ts' },
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ].concat(isDevBuild ? [] : [
            new AotPlugin({
                tsConfigPath: './tsconfig.aot.json',
                entryModule: path.join(__dirname, 'ClientApp/app/app.module.server#AppModuleNode'),
                exclude: ['./**/*.client.ts']
            })
        ]),
    });

    return [clientBundleConfig, serverBundleConfig];
};
