// routes exist in a separate file to make hot-reloading of express routes possible
import { Router } from 'express';

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

router.get('*', (req, res) => {
	if (!req.user) {
		return res.redirect('/auth/twitter');
	}

	console.log(req.user);

	const model = {
		title: 'fly-south',
		message: `Hello ${req.user.name}!`
	};

	res.status(200).end(`<!DOCTYPE HTML>${renderToString(<App model={model} />)}`);
});

export default router;