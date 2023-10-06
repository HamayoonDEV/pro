import Joi from "joi";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import JwtService from "../services/JwtServices.js";
import Refresh from "../models/token.js";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const authController = {
  //create user Register method
  async register(req, res, next) {
    const registerUserSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, name, email, password } = req.body;

    //password hashing
    const hashsedPassword = await bcrypt.hash(password, 10);
    //handle username and email conflict
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });
      if (emailInUse) {
        const error = {
          status: 409,
          message: "email is alread in use please use anOther email!!",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username is not available please choose anOther username!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //save in database
    let user;
    try {
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashsedPassword,
      });
      user = await userToRegister.save();
    } catch (error) {
      return next(error);
    }
    const accessToken = JwtService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtService.signRefreshToken({ _id: user._id }, "60m");
    //save refresh Token to the database
    await JwtService.storeRefreshToken(user._id, refreshToken);
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(201).json({ user, auth: true });
  },

  //login method
  async login(req, res, next) {
    const loginUserSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = loginUserSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { username, password } = req.body;
    let user;
    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "invalid username",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    const accessToken = JwtService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtService.signRefreshToken({ _id: user._id }, "60m");
    //update tokens to the database
    await Refresh.updateOne(
      { _id: user._id },
      { token: refreshToken },
      { upsert: true }
    );
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(200).json({ user, auth: true });
  },
  //logout method
  async logout(req, res, next) {
    //fetch refresh token from cookies
    const { refreshToken } = req.cookies;
    try {
      await Refresh.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //sending response
    res.status(200).json({ user: null, auth: false });
  },
  //refresh method
  async refresh(req, res, next) {
    //fething refreshToken from cookie
    const originalRefreshToken = req.cookies.refreshToken;
    let id;
    try {
      id = JwtService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      const e = {
        status: 401,
        message: "unAuthorized",
      };
      return next(e);
    }
    //verifying the token
    try {
      const match = await Refresh.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "unAuthorized",
        };
        return next(e);
      }
    } catch (error) {
      return next(error);
    }
    //genrate new Tokens
    const accessToken = JwtService.signAccessToken({ _id: id }, "30m");
    const refreshToken = JwtService.signRefreshToken({ _id: id }, "60m");
    //update database
    await Refresh.updateOne({ _id: id }, { token: refreshToken });
    //sending to the cookies
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    const user = await User.findOne({ _id: id });
    res.status(200).json({ user, auth: true });
  },
};

export default authController;
