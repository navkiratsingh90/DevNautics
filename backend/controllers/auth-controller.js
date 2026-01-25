import User from '../models/user-model.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from '../utils/nodemailer.js'

// ===================== AUTH =====================


// ---------- REGISTER ----------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(username, email,password);
    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already registered" });

    // const hashed = await bcrypt.hash(password, 10);
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // const newUser = await User.create({
    //   username,
    //   email,
    //   password: hashed,
    //   verificationCode: otp,
    //   verificationExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
    // });

    const newUser = new User({ username, password, email }); // password will be hashed in model
    await newUser.save();
    // send verification email
    // await transporter.sendMail({
    //   to: email,
    //   subject: "Verify your account",
    //   text: `Your verification code is ${otp}`,
    // });

    res.status(200).json({ msg: "User registered. Check email for OTP." ,data : newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------- VERIFY EMAIL ----------
export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.verificationCode !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });
    if (user.verificationExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    user.verificationCode = null;
    user.verificationExpiry = null;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getUser = async (req,res) => {
  try {
    const userId = req.user.userID || req.user._id;
    const user = await User.findById(userId);
    if (!user) res.status(400).json({
      msg : "not authprised"
    })
    res.status(200).json({
      msg : "approved",
      user
    })
  } catch (error) {
      console.error(error);
  }
}
// ---------- LOGIN ----------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // if (!user.isVerified) {
    //   return res.status(403).json({ msg: "Please verify your email first" });
    // }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password", user });
    }

     // Generate token
     const token = await user.generateToken();
     res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/"
    });
    

    res.status(200).json({
      msg: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error});
  }
};


// ---------- LOGOUT ----------
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};

// ---------- FORGOT PASSWORD ----------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.verificationExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    });

    res.status(200).json({ msg: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.verificationCode !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });
    if (user.verificationExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.verificationCode = null;
    user.verificationExpiry = null;
    await user.save();

    res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ---------- JWT AUTH MIDDLEWARE ----------
export const jwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded.userID;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};