// bundling of bundle.js
// there is a lot of boilerplate here which we want to avoid as much as possible
// TODO: Move into separate node module
import webpack from 'webpack';
import { Router } from 'express';
import compression from 'compression';
import MemoryFs from 'memory-fs';

import { BUNDLE_PATHNAME, BUNDLE_SOURCE } from 'common/constants';

let error;
let compiling = true;

const fs = new MemoryFs();
const assets = [];
const compiler = webpack({
	entry: {
		app: [
			require.resolve('babel-polyfill'),
			BUNDLE_SOURCE
		]
	},
	output: {
		path: '/',
		publicPath: '/',
		filename: 'bundle.js',
		chunkFilename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			}
		]
	},
	devtool: 'inline-source-map'
});

compiler.outputFileSystem = fs;

console.log('⌛️  Compiling...');
compiler.watch({}, (err, stats) => {
	error = err || stats.hasErrors() && stats.toString({
		chunks: false,
		colors: true
	});

	if (error) {
		console.error(error);
	} else {
		stats.toJson().assets.forEach(({name, size}) => {
			const sizeInMb = size / 1024 / 1024;
			console.log(`🎁  ${name} (${sizeInMb.toFixed(2)}Mb)`);
			assets.push(`/${name}`);
		});
		console.log('✅  Bundle compiled');
		compiling = false;
	}
});

compiler.plugin('watch-run', (watching, cb) => {
	console.log('⌛️  Recompiling...');
	compiling = true;
	cb();
});

const sleep = duration => new Promise(ok => setTimeout(ok, duration));
const retry = (condFn, execFn, duration = 500) => {
	if (condFn()) {
		return Promise.resolve(execFn());
	} else {
		console.log('😴  Please wait...');
		return sleep(duration).then(() => retry(condFn, execFn, duration));
	}
}

export default function() {

	const router = Router();

	router.use(compression({ level: 9 }));
	router.get(BUNDLE_PATHNAME, (req, res) => {
		if (error) {
			return res.status(500).send('Webpack compilation error, check console');
		}

		return retry(() => !compiling, () => {
			res.set('Content-type', 'application/javascript');
			res.send(fs.readFileSync('/bundle.js'))
		});
	});

	router.get('*', ({ originalUrl }, res, next) => {
		if (assets.some(asset => asset === originalUrl)) {
			return res.send(fs.readFileSync(originalUrl));
		}

		return next();
	});


	return router;
}