import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import foods from "./routes/foods";
import meals from "./routes/meals";
import session from "express-session";
import passport from "passport";
import Auth0Strategy from "passport-auth0";

dotenv.config();
const app = express();
// const prisma = new PrismaClient();

app.use(
  cors({
    origin: `${process.env.DEPLOY_URL}`,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN!,
      clientID: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      callbackURL: process.env.AUTH0_CALLBACK_URL!,
    },
    (
      accessToken: string,
      refreshToken: string,
      extraParams: any,
      profile: Express.User,
      done: (err: any, user?: Express.User) => void,
    ) => {
      done(null, profile);
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

app.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
);

app.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/" }),
  (_req: Request, res: Response) => {
    res.redirect(`${process.env.DEPLOY_URL}/home`);
  },
);

app.get("/api/user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

app.use("/foods", foods);
app.use("/meals", meals);

app.listen(3000, () =>
  console.log("Server listening on http://localhost:3000"),
);
