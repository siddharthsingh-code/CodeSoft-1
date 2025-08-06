const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser")
require("dotenv").config();
const JWT_SECRET = process.env.JWTSECRET;


router.get("/me", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").select("-_id");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});





router.post(
  "/createuser",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("profession").notEmpty().withMessage("Profession is required"),
    body("institution").notEmpty().withMessage("Institution is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User already exists with this email" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        profession: req.body.profession,
        institution: req.body.institution,
        password: hashedPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.status(200).json({
        success,
        authtoken,
        user: {
          name: user.name,
          email: user.email,
          profession: user.profession,
          institution: user.institution,
          stars: user.stars, // will be 0 initially
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);



// ROUTE 2: Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").exists().withMessage("Password cannot be blank"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "User doesn't exist with this email" });
      }

      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({
        success,
        authtoken,
        user: {
          name: user.name,
          email: user.email,
          usertype: user.usertype,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


router.put(
  "/updateuser",
  fetchuser,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("profession")
      .optional()
      .notEmpty()
      .withMessage("Profession cannot be empty"),
    body("institution")
      .optional()
      .notEmpty()
      .withMessage("Institution cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, profession, institution } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (profession) updatedFields.profession = profession;
    if (institution) updatedFields.institution = institution;

    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updatedFields },
        { new: true }
      )
        .select("-password")
        .select("-_id"); // omit password from response

      res.json({ success: true, user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);



router.put(
  "/updatepassword",
  fetchuser,
  [
    body("currentPassword", "Current password is required").exists(),
    body("newPassword", "New password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);




router.put("/addstars", fetchuser, async (req, res) => {
  const { starsToAdd } = req.body;

  if (typeof starsToAdd !== "number" || starsToAdd < 0) {
    return res.status(400).json({ error: "starsToAdd must be a positive number" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    user.stars += starsToAdd;
    await user.save();

    res.json({ message: "Stars updated", stars: user.stars });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getstars",fetchuser,async(req,res)=>{
   try {
    const user =await User.findById(req.user.id);
    if(!user) return res.status(404).send("User not found");

    res.json({stars:user.stars});
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
   }
})
module.exports = router;