const db = require("../models");

module.exports = {
  createUser: function(req, res) {
    db.User.create(req.body)
      .then(userData => res.json(userData))
      .catch(err => res.json(err));
  },

  findUser: function(req, res) {
    db.User.findOne({ email: req.params.email }).then(dbData =>
      res.json(dbData)
    );
  },
  pushWorkOut: function(req, res) {
    db.User.findByIdAndUpdate(req.body.userId, {
      $push: { workouts: req.body.id }
    })
      .then(data => res.json(data))
      .catch(err => console.log(err));
  },
  findUserWorkOuts: function(req, res) {
    db.User.find({ _id: req.params.id })
      .populate("workouts")
      .then(data => res.json(data));
  },
  findWorkOutsByWeek: function(req, res) {
    let { week, name, user, type } = req.params;
    week = parseInt(week);
    type === "resistance"
      ? db.WorkOut.aggregate([
          { $unwind: "$resistance" },
          {
            $match: {
              $and: [
                { "resistance.name": name },
                { week: week },
                { user: user }
              ]
            }
          }
        ]).then(workOutData => res.json(workOutData))
      : db.WorkOut.aggregate([
          { $unwind: "$cardio" },
          {
            $match: {
              $and: [{ "cardio.name": name }, { week: week }, { user: user }]
            }
          }
        ]).then(workOutData => res.json(workOutData));
  },

  updateSettings: function(req, res) {
    db.User.findByIdAndUpdate(req.body.id, {
      $set: {
        [req.body.setting]: req.body.settingValue
      }
    })
      .then(data => res.json(data))
      .catch(err => console.log(err));
  },

  uploadPicture: function(req, res) {
    db.User.findByIdAndUpdate(req.body.id, {
      picture: req.body.photo
    }).catch(err => console.log(err));
  },

  findProfile: function(req, res) {
    db.User.find({ username: req.params.username })
      .then(user => {
        res.json(user);
      })
      .catch(err => console.log(err));
  },
  updateProfileAbout: function(req, res) {
    console.log(req.body);
    db.User.findByIdAndUpdate(req.body.id, req.body.updateProfile).catch(err =>
      console.log(err)
    );
  }
};
