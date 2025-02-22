// const User = require("../model/")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const TokenBlacklist = require("../model/TokenBlacklist");

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Helper function to compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Register a new user
const registerUser = async (req, res) => {
  
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists, User Different Email" });

    // const hashedPassword = await hashPassword(password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // Manually create a new object without the password field
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Compare entered password with hashed password

//     // const isMatch = await comparePassword(password, user.password);
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(404).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES,
//     });

//     // Manually create a new object without the password field
//     const userResponse = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       password:user.password,
//       createdAt: user.createdAt,
//     };
//     res
//       .status(200)
//       .json({ message: "Login successful", token, user: userResponse });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // Store token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
    });

        // Manually create a new object without the password field
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password:user.password,
      createdAt: user.createdAt,
    };
    res.status(200).json({ message: "Login successful", token, user: userResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get All User
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    // Manually exclude password field from all users
    const usersResponse = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    }));

    res.status(200).json({ message: "Users fetched successfully", users: usersResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get user profile
const getUserProfile = async(req,res)=>{
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({message:"User not found"})
    }

    // Manually create a response object without the password field
    const userResponse = {
      _id: user._id,
      username:user.username,
      email:user.email,
      createdAt:user.createdAt
    }
    res.status(200).json({ message: "User profile fetched successfully", user: userResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update user profile

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Manually create a new object without the password field
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    // await userResponse.save();
    res.status(200).json({ message: "User updated successfully", user: userResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete user

const deleteUser = async(req,res)=>{
  try {
    const user = await User.findByIdAndDelete(req.user.id)
    if (!user) {
      return res.status(404).json({message:"User not found"})
    }

    // Manually create a new object without the password field
    const userResponse = {
      _id : user._id,
      username: user.username,
      email:user.email,
      createdAt:user.createdAt
    }

    res.status(200).json({message:"User deleted successfully", user:userResponse})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}


// Logout User

// const logoutUser = async (req, res) => {
//   try {
//     res.cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(0), // Expire the cookie immediately
//       secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
//       sameSite: "strict", // Prevent CSRF attacks
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Logout failed", error: error.message });
//   }
// };


//  another
// const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Logout failed", error: error.message });
//   }
// };
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract JWT token from header

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};



module.exports = { registerUser, loginUser, updateUserProfile,deleteUser, getUserProfile, getAllUsers, logoutUser };
