// server/src/config/passport-setup.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel as User } from '../db/users';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '253325761744-ijjd0no5uuhv1s7g2udjof3i4d4pisjt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback',
},
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;

    if (!email) {
      return done(new Error('No email found'), null);
    }

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: email,
        role: 'publicUser'  // Assign role based on your logic
      });
      await user.save();
    }
    done(null, user);
  }
));

passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, role: user.role }); // Ensure role is serialized if needed
});

passport.deserializeUser(async (data: { id: string, role: string }, done) => {
  try {
    const user = await User.findById(data.id);
    done(null, { id: user._id, role: user.role });
  } catch (err) {
    done(err, null);
  }
});