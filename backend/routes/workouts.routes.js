const express = require("express");

const { authenticateUser } = require("../middleware/users.middleware");
const { Workout } = require("../models/Workouts.model");
const { DailyLog } = require("../models/DailyLogs.model");
const { mongoose } = require("mongoose");

const workoutRouter = express.Router();

const todayDate = () => {
  return new Date().toISOString().split("T")[0];
};

workoutRouter.post("/addWorkout", authenticateUser, async (req, res) => {
  try {
    const reqData = req.body;

    const workout = await Workout.findOne({
      date: todayDate(),
      user: req.userId,
    });

    if (!workout) {
      const newWorkout = new Workout({
        user: req.userId,
        date: todayDate(),
        exercises: reqData,
      });
      await newWorkout.save();

      const dailyLogs = await DailyLog.findOne({
        date: todayDate(),
        user: req.userId,
      });

      if (!dailyLogs) {
        const newDailyLogs = new DailyLog({
          user: req.userId,
          date: todayDate(),
          workouts: newWorkout._id,
        });
        await newDailyLogs.save();
      } else {
        const updateDailyLogs = await DailyLog.findByIdAndUpdate(
          dailyLogs._id,
          { workouts: newWorkout._id }
        );
      }

      return res
        .status(201)
        .json({ message: "New Workout Added", data: newWorkout });
    } else {
      const updateWorkout = await Workout.findByIdAndUpdate(
        workout._id,
        {
          exercises: [...workout.exercises, ...reqData],
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .json({ message: "Workout Updated", data: updateWorkout });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
});

workoutRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const workout = await Workout.findOne({
      date: todayDate(),
      user: userId,
    });

    if (!workout) {
      return res.status(200).json({ data: null });
    } else {
      const result = await Workout.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: todayDate(),
          },
        },
        { $unwind: "$exercises" },
        {
          $lookup: {
            from: "exercises",
            localField: "exercises.exercise",
            foreignField: "_id",
            as: "ExerciseDetails",
          },
        },
        { $unwind: "$ExerciseDetails" },
        {
          $project: {
            _id: 0,
            ExerciseDetails: 1,
            duration: "$exercises.duration",
          },
        },
      ]);

      return res.status(200).json({ data: result });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
});

workoutRouter.all("*", (req, res) => {
  return res.status(404).json({ error: true, message: "404 Invalid Route" });
});

module.exports = { workoutRouter };
