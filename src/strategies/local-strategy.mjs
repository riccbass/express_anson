import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../moongose/schemas/user.model.mjs";
import { compareSync } from "bcrypt";

passport.serializeUser((user, done) => {
  console.log(`Inside serialized user`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside deserialized`);

  try {
    const findUser = await User.findById(id);

    if (!findUser) {
      throw new Error("User not found");
    }

    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });

      if (!findUser) {
        throw new Error("User not found");
      }

      if (!compareSync(password, findUser.password)) {
        throw new Error("Bad credentials!");
      }

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
