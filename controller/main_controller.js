const Codes = require("../models/code");
const LiveCode = require("../models/live_code");

const apiRes = {
  message: "Authentication success",
  authorization: true,
  status: 401,
  data: {},
};

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
          res.status(200).json(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("error while searching data: ", error);
    }
  },
  // to get get template detail
  getTemplateDetail: (req, res) => {
    const tempId = req.query.id;
    Codes.findById(tempId)
      .then((data) => {
        console.log(data);
        apiRes.status = 200;
        apiRes.authorization = "null";
        apiRes.message = "data found";
        apiRes.data = data;
        res.status(200).json(apiRes);
      })
      .catch((e) => {
        console.log("error while fetching template detail");
        apiRes.status = 404;
        apiRes.authorization = "null";
        apiRes.message = "data not found!";
        apiRes.data = null;
        res.status(404).json(apiRes);
      });
  },

  // to check is valid live or not
  isValidLive: (req, res) => {
    LiveCode.findOne({ room_id: req.query.roomId })
    .then((data) => {
      if (data) {
          res.status(200).json(true);
        } else {
          res.status(200).json(false);
        }
      })
      .catch((e) => {
        res.status(404).json("Something went wrong!");
      });
  },
};
