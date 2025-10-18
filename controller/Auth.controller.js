import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import BlackListToken from "../model/blacklist.model.js";
import { v4 as uuidv4 } from "uuid";
export async function Signup(req,res) {
  const {name, password ,email,avatar} = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      res.status(403).json({
        message: "User already exists with this username",
        success: false,
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      id:uuidv4(),
      email,
      password: hashPassword,
      name,
      avatar
    });
    res.status(200).json({
      message: "User Signed Up",
      success: true,
    });
    return;
  } catch (e) {
    console.log("sign up e", e);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
    return;
  }
}


export async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(403).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    let isMatch = false;

    // Check if password is already hashed
    const isHashed = findUser.password.startsWith("$2b$");

    if (isHashed) {
      // Normal bcrypt comparison
      isMatch = await bcrypt.compare(password, findUser.password);
    } else {
      // Old plain-text password
      isMatch = password === findUser.password;

      if (isMatch) {
        // Hash the old password and update DB
        const hashed = await bcrypt.hash(password, 10);
        findUser.password = hashed;
        await findUser.save();
      }
    }

    if (!isMatch) {
      return res.status(403).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    // Create JWT if secret exists
    if (process.env.JWT_SECRET) {
      const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // set true if using HTTPS
        sameSite: "none", // 'none' if deployed cross-site
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: `Welcome ${findUser.name}`,
        success: true,
      });
    }

  

  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
}

export async function getMe(req, res){
  const user = req.user;
  try {
    res.status(200).json({
      success: true,
      name: user.name,
      avatar:user.avatar,
      role:user.role
    });
  } catch (e) {
    console.log("get me e", e);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
    return;
  }
}
export async function Logout(req, res) {
  const token = req.cookies.token;
  if (!token) {
    res.status(403).json({
      message: "Invalid Credentials",
      success: false,
    });
    return;
  }
  try {
    await BlackListToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (e) {
    console.log("logout e", e);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
    return;
  }
}
export async function AdminSignup(req, res) {
  try {
    const { name, email, password, avatar, adminKey } = req.body;

    // Check admin key
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: "Invalid admin key", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists", success: false });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create admin user
    await User.create({id:uuidv4(), name, email, password: hashPassword, avatar, role: "admin" });

    return res.status(200).json({ message: "Admin created", success: true });
  } catch (error) {
    console.error("Admin signup error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}
