const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

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
    { loader: 'css-loader', options: { minimize: true } },
    { loader: 'postcss-loader', options: { plugins: [autoprefixerPlugin] } }
];
const devSCSSLoaders = [
    'css-loader',
    'sass-loader',
    { loader: 'postcss-loader', options: { plugins: [autoprefixerPlugin] } }
];
const prodSCSSLoaders = [
    { loader: 'css-loader', options: { minimize: true } },
    'sass-loader',
    { loader: 'postcss-loader', options: { plugins: [autoprefixerPlugin] } }
];

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: {
            modules: false
        },
        context: __dirname,
        resolve: {
            extensions: ['.js', '.ts']
        },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.css$/, include: [/components/], use: ['to-string-loader'].concat((isDevBuild) ? devCSSLoaders : prodCSSLoaders) },
                { test: /\.scss$/, include: [/components/], use: ['to-string-loader'].concat((isDevBuild) ? devSCSSLoaders : prodSCSSLoaders) },
                {
                    test: /\.scss$/,
                    include: [/main-styles.scss$/],
                    exclude: [/components/],
                    use: ['to-string-loader'].concat(extractCSSMain.extract({
                        use: [].concat((isDevBuild) ? devSCSSLoaders : prodSCSSLoaders)
                    }))
                },
                {
                    test: /\.(woff2?|ttf|eot|svg)$/,
                    use: 'file-loader?name=[path][name].[ext]'
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: 'file-loader?name=[path][name].[ext]'
                }
            ].concat((isDevBuild) ? [
                { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
            ] : [
                    { test: /\.ts$/, use: '@ngtools/webpack' },
                ])
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(), // webpack 3
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'isDevelopment': JSON.stringify(isDevBuild),
                'VERSION': JSON.stringify(new Date().toISOString()),
            }),
            new CheckerPlugin(),
            extractCSSMain

        ].concat(isDevBuild ? [] : [
            // fixed bugs for production build
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.join(__dirname, './ClientApp')), // Workaround for https://github.com/angular/angular/issues/14898
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ])
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            'main-client': './ClientApp/boot.browser.ts'
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir)
        },
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
                new UglifyjsWebpackPlugin(),
                // Plugins that apply in production builds only
                new AngularCompilerPlugin({
                    mainPath: path.join(__dirname, 'ClientApp/boot.browser.ts'),
                    tsConfigPath: './tsconfig.json',
                    entryModule: path.join(__dirname, 'ClientApp/app/app.browser.module#AppModule'),
                    exclude: ['./**/*server.module.ts']
                }),
            ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig, {
        resolve: {
            mainFields: ['main']
        },
        entry: {
            'main-server': (isDevBuild) ? './ClientApp/boot.server.ts' : './ClientApp/boot.server.PRODUCTION.ts'
        },
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: false,
                output: {
                    ascii_only: true,
                }
            }),
            // Plugins that apply in production builds only
            new AngularCompilerPlugin({
                mainPath: path.join(__dirname, 'ClientApp/boot.server.PRODUCTION.ts'),
                tsConfigPath: './tsconfig.json',
                entryModule: path.join(__dirname, 'ClientApp/app/app.server.module#AppModule'),
                exclude: ['./**/*browser.module.ts']
            })
        ]),
        target: 'node',
        devtool: (isDevBuild) ? 'cheap-eval-source-map' : false
    });

    return [clientBundleConfig, serverBundleConfig];
}