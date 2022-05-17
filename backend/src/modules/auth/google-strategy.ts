// google-strategy.ts
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as passport from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {

  constructor(private readonly config : ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_SECRET'),
      callbackURL: "http://localhost:3000/login",
      passReqToCallback: true,
      scope: ["email", "profile"]
    }, (req, accessToken, refreshToken, profile, done) => {
      console.log(req);
      const user: any = {
        email: profile.emails[0].value,
        displayName: profile.displayName,
        googleAccount: {
          googleId: profile.id,
          googleToken: accessToken,
        },
      };
      return done(null, user);
    });

    passport.use(this);

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      console.log(user);
      done(null, user);
    });

  }
}