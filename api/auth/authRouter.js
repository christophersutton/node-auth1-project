const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./userModel");
const router = express.Router();

router.post("/register", async (req, res) => {
  const user = req.body;

  if (user) {
    Users.create(user)
      .then((user) => {
        req.session.user = user;
        res.status(201).json({ user });
      })
      .catch(() => {
        res.status(500).json({ message: "Couldn't create profile" });
      });
  } else {
    res.status(404).json({ message: "Profile missing" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  Users.findBy({ email })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //eslint-disable-next-line
        const { password, ...userResp } = user;
        req.session.user = user;
        res.status(200).json({
          user: userResp,
        });
      } else
        res.status(401).json({ message: "Incorrect username or password" });
    })
    .catch(() => {
      res.status(401).json({ message: "Email not found" });
    });
});

router.get("/users", async (req, res) => {
  if (req.session.user) {
    Users.findAll()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch(() => {
      res.status(500).json({ message: "Couldn't retrieve users" });
    });
  }
  else {
    res.status(401).json({message:"You must be logged in"})
  }
  
});

module.exports = router;
