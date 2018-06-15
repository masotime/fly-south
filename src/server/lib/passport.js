import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Router } from 'express';
import session from 'express-session';

function getConfig() {
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  const port = process.env.PORT === '80' ? '' : (process.env.PORT || '8000');
  const domain = process.env.DOMAIN || 'www.masotime.com';
  const callbackURL = `http://${domain}:${port}/auth/twitter/callback`;

  if (!consumerKey) throw new Error('Could not find TWITTER_CONSUMER_KEY in env variables');
  if (!consumerSecret) throw new Error('Could not find TWITTER_CONSUMER_SECRET in env variables');

  return { consumerKey, consumerSecret, callbackURL };
}

const twitterStrategy = new TwitterStrategy(
  getConfig(),
  (token, tokenSecret, profile, done) => {
    done(null, {
      ...profile._json,
      token,
      tokenSecret
    });
  }
);

passport.use(twitterStrategy);
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

export default function twitterLoginMiddleware() {
  const router = new Router();
  const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  };

  // middleware required to support login persistence
  router.use(session(sessionConfig));
  router.use(passport.initialize());
  router.use(passport.session());  

  router.get('/auth/twitter', passport.authenticate('twitter'));
  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/?success=true',
      failureRedirect: '/?success=false'
    })
  );

  return router;
}