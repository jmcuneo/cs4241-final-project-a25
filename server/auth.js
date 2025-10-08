import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/User.js';
// configure passport and auth routes
export function configureAuth(app) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await User.findById(id)); } catch (e) { done(e); }
  });

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value
        });
      } else {
        user.name = profile.displayName || profile.username;
        user.avatar = profile.photos?.[0]?.value;
        await user.save();
      }
      done(null, user);
    } catch (e) { done(e); }
  }));
// initialize passport
  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => res.redirect(`${process.env.CLIENT_REDIRECT_SUCCESS || '/'}`)
  );

  app.post('/auth/logout', (req, res) => {
    req.logout(() => {
      req.session.destroy(() => res.json({ ok: true }));
    });
  });
}
