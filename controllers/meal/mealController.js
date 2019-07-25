const db = require("../../models");
var ObjectId = require("mongodb").ObjectID;

module.exports = {
  findAll: function(req, res) {
    db.Nutrition.find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Nutrition.aggregate([
      { $unwind: "$meal" },
      { $match: { "meal._id": ObjectId(req.params.id) } }
    ])
      .then(dbData => {
        res.json(dbData);
      })
      .catch(err => {
        console.log(err);
      });
  },
  findMealNames: function(req, res) {
    const { user } = req.params;
    db.Nutrition.find({ user })
      .sort({ date: -1 })
      .then(mealData => {
        let nameArray = [];
        let idArray = [];

        mealData.forEach(day => {
          if (day.meal) {
            day.meal.forEach(meal => {
              if (!nameArray.includes(meal.name)) {
                nameArray.push(meal.name);
                idArray.push(meal._id);
              }
            });
          }
        });

        var mealNames = nameArray.map(function(name, index) {
          return { name: name, _id: idArray[index] };
        });

        res.json(mealNames);
      });
  },
  findByDate: function(req, res) {
    let timeFrame = "";
    let { date, user } = req.params;

    if (date.length > 2) {
      timeFrame = "date";
    } else {
      timeFrame = "week";
      date = parseInt(date);
    }

    db.Nutrition.find({ [timeFrame]: date, user: user })
      .then(mealData => res.json(mealData))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Nutrition.updateOne(
      { date: req.body.date, user: req.body.user },
      { $set: req.body },
      { upsert: true, runValidators: true }
    )
      .then(dbData => {
        res.json(dbData);
      })
      .catch(err => {
        console.log(err);
      });
  },
  remove: function(req, res) {
    db.Nutrition.findById(req.params.id)
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
