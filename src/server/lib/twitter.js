import Twitter from 'twitter';
import { Router } from 'express';
import bodyParser from 'body-parser';

class TwitterApi {
  constructor(user) {
    // assumes user has token and tokenSecret
    const consumer_key = process.env.TWITTER_CONSUMER_KEY;
    const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
    const access_token_key = user.token;
    const access_token_secret = user.tokenSecret;

    if (!consumer_key) throw new Error('Unable to find TWITTER_CONSUMER_KEY in env');
    if (!consumer_secret) throw new Error('Unable to find TWITTER_CONSUMER_SECRET in env');
    if (!access_token_key) throw new Error('API requires token to be defined in user object');
    if (!access_token_secret) throw new Error('API requires tokenSecret to be defined in user object');
    
    this.client = new Twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret
    });
  }

  async getUserTimeline(screen_name) {
    return await this.client.get('statuses/user_timeline', { screen_name, tweet_mode: 'extended', count: 200 });
  }
}

export default function apiMiddleware() {
  const router = new Router();

  router.use(bodyParser.json());
  router.post('/getTweets', async (req, res, next) => {
    try {
      const { user, body: { screen_name } } = req;
      const api = new TwitterApi(user);
  
      const timeline = await api.getUserTimeline(screen_name);
      return res.json(timeline);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

  return router;
}