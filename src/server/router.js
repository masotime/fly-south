// routes exist in a separate file to make hot-reloading of express routes possible
import { Router } from 'express';
import favicon from 'express-favicon';
import { join } from 'path';

// passport stuff
import TwitterLoginMiddleware from 'server/lib/passport';
import ApiMiddleware from 'server/lib/twitter';

// React stuff
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from 'components';

const router = Router();

router.use(TwitterLoginMiddleware());
router.use(ApiMiddleware());
router.use(favicon(join(process.cwd(), 'static', 'favicon.jpeg')));

router.get('/favico')

router.get('/:screen_name?', (req, res) => {
	if (!req.user) {
		return res.redirect('/auth/twitter');
	}

	const model = {
		title: 'Twitter Map Projector',
		message: `Hello ${req.user.name}!`,
		screen_name: req.params.screen_name,
	};

	res.status(200).end(`<!DOCTYPE HTML>${renderToString(<App model={model} />)}`);
});

export default router;