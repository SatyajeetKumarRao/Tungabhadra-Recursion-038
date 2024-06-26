require("dotenv").config();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { User } = require("../models/users.model");
const { BlacklistToken } = require("../models/blacklistToken.model");
const {
  TdeeCalculator,
  TargetTdeeCalculator,
} = require("../utils/TdeeCalculator");

const saltRounds = 10;

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "User doesn't exist. Try to register." });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        throw new Error(err);
      }

      if (result) {
        const accessToken = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          accessToken,
          data: {
            userId: user._id,
            email: user.email,
          },
          message: "User logged in successfully",
        });
      } else {
        return res
          .status(400)
          .json({ error: true, message: "Invalid email or password" });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password, height, initialWeight, dob, gender, goals } =
      req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ error: true, message: "Uses already exists" });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        throw new Error(err);
      }

      const TDEE = TdeeCalculator({
        gender,
        weight: initialWeight,
        height,
        dob,
        activityLevel: goals.activityLevel,
      });

      const targetTdee = TargetTdeeCalculator({ goal: goals.goal, TDEE });

      const user = new User({
        name,
        email,
        password: hash,
        height,
        initialWeight,
        currentWeight: initialWeight,
        dob,
        gender,
        goals,
        tdee: TDEE,
        targetTdee: targetTdee,
        friends: [],
        cumulativeNetCalories: 0,
      });

      await user.save();

      return res.status(200).json({
        data: {
          userId: user._id,
          email: user.email,
        },
        message: "New user has been registered",
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
};

// const getUsers = async (req, res) => {
//   try {
//     const page = req.query.page - 1 || 0;
//     const limit = req.query.limit || 5;

//     const userData = await User.find({}, { password: 0 })
//       .skip(limit * page)
//       .limit(limit);

//     const totalData = await User.countDocuments();

//     const totalPages = Math.ceil(totalData / limit);

//     return res.status(200).json({
//       error: false,
//       limit,
//       currentPage: page + 1,
//       totalCount: totalData,
//       totalPages,
//       data: userData,
//       message: "User get route",
//     });
//   } catch (error) {
//     console.log(error.message);

//     return res.status(400).json({ error: true, message: error.message });
//   }
// };

const getUserById = async (req, res) => {
  try {
    const id = req.userId;

    const userData = await User.findById(id, { password: 0 });

    if (!userData) {
      return res
        .status(404)
        .json({ error: true, message: `User with Id : ${id} doesn't exists.` });
    }

    return res.status(200).json({
      data: userData,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.userId;

    const { height, currentWeight, goals } = req.body;

    const userData = await User.findById(id, { password: 0 });

    if (!userData) {
      return res.status(404).json({
        error: true,
        message: `User with Id : ${id} doesn't exists.`,
      });
    }

    const TDEE = TdeeCalculator({
      gender: userData.gender,
      weight: currentWeight,
      height,
      dob: userData.dob,
      activityLevel: goals.activityLevel,
    });

    const targetTdee = TargetTdeeCalculator({ goal: goals.goal, TDEE });

    const updatedUserData = await User.findByIdAndUpdate(
      id,
      { height, goals, currentWeight, tdee: TDEE, targetTdee: targetTdee },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      data: updatedUserData,
      message: `User with Id :${id} has been updated`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
};

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const userData = await User.findByIdAndDelete(id);

//     if (!userData) {
//       return res.status(404).json({
//         error: true,
//         message: `User with Id : ${id} doesn't exists.`,
//       });
//     }

//     return res.status(200).json({
//       error: false,
//       data: userData,
//       message: `User with Id :${id} has been deleted`,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).json({ error: true, message: error.message });
//   }
// };

const logoutUser = async (req, res) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] == "Bearer"
    ) {
      const accessToken = req.headers.authorization.split(" ")[1];

      const blacklistToken = new BlacklistToken({ token: accessToken });

      await blacklistToken.save();

      return res.status(200).json({
        message: "User logged out successfully",
      });
    } else {
      return res
        .status(400)
        .json({ error: true, message: "Access Token Required" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
};

module.exports = {
  userLogin,
  userRegister,
  // getUsers,
  getUserById,
  updateUser,
  // deleteUser,
  logoutUser,
};
