const path = require('path');
const User = require(path.join(__dirname, '../models/User'));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const crypto = require("crypto");


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (role === "student" && !/^[\w-.]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ msg: "Invalid email format for students. Use example@gmail.com." });
    }
    if (role === "instructor" && !/^[\w-.]+@einfratechsys\.(com|tech)$/.test(email)) {
      return res.status(400).json({ msg: "Invalid email format for instructors. Use example@einfratech.com." });
    }
    if (user) return res.status(400).json({ msg: "User already exists" });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ msg: "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    user = new User({ name, email, password: hashedPassword, role, isVerified: false, verificationToken });
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    });

    res.status(201).json({ msg: "User registered successfully. Please check your email to verify your account." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found!" });
    if (!user.isVerified) return res.status(400).json({ msg: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.role === 'student' && { learningHistory: user.learningHistory }) 
    };
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: responseUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





