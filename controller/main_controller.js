const Codes = require("../models/code");

module.exports = {
  // to get all templates
  getTemplates: async (req, res) => {
    try {
      const templates = await Codes.find({ isGuest: false }).populate("user");
      res.status(200).json({ all_templates: templates });
    } catch (error) {
      console.log("error: ", error);
    }
  },

  // globally searching templates
  searching: (req, res) => {
    try {
      const query = req.query.q;
      console.log("q: ", query);
      Codes.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $match: {
            $and: [
              {
                $and: [
                  { isGuest: { $eq: false } },
                  { isPrivate: { $eq: false } },
                ],
              },
              {
                $or: [
                  {
                    title: { $regex: query, $options: "i" },
                  },
                  {
                    "userData.full_name": { $regex: query, $options: "i" },
                  },
                ],
              },
            ],
          },  
        },
      ])
        .then((data) => {
          console.log(data);
          res.status(200).json(data)
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("error while searching data: ", error);
    }
  },
};

