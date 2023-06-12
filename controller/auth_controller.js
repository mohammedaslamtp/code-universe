const { request } = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

module.exports = {
  // new user registering
  signup: (req, res) => {
    let data = req.body;
    let response = {};
    try {
      const salt = bcrypt.genSaltSync(10);
      let hash_password = bcrypt.hashSync(data.new_password, salt);
      User.findOne({ email: data.email }).then((doc) => {
        if (doc) {
          res.status(404).json("email already exist!");
        } else {
          User.create({
            full_name: data.fullName,
            email: data.email,
            phone: Number(data.phone),
            password: hash_password,
            otp_verified: false,
          })
            .then((doc) => {
              console.log("Registered successfully.");
              let accessToken = jwt.sign(
                data,
                process.env.ACCESS_SECRET_TOKEN,
                {
                  expiresIn: "15m",
                }
              );

              let refreshToken = jwt.sign(
                data,
                process.env.REFRESH_SECRET_TOKEN,
                {
                  expiresIn: "14d",
                }
              );
              response.accessToken = accessToken;
              response.refreshToken = refreshToken;
              response.otp_verified = false;
              console.log("response ", response);
              res.status(200).json(response);
            })
            .catch((err) => {
              if (err.code === 11000) {
                console.log("dupe error ", err);
                let exist = Object.keys(err.keyValue)[0];
                if (exist == "full_name") exist = "Full Name";
                console.log("exist: ", exist);
                res.status(404).json(`${exist} already exist!`);
              } else {
                res.status(404).json({ error: err });
              }
            });
        }
      });
    } catch (err) {
      console.log("signup error!", err);
      if (error instanceof MongoServerError && error.code === 11000) {
      }
    }
  },

  // user login
  login: async (req, res) => {
    try {
      let username = req.body.email;
      let response = {};
      await User.findOne({
        $or: [{ email: username }, { full_name: username }],
      })
        .then((doc) => {
          if (doc !== null) {
            response.email = true;
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
              if (err) {
                // bcryption went somthing wrong
                console.log("bcryption went somthing wrong!! ", err);
              } else {
                if (result) {
                  response.password = true;
                  // blocked or not
                  if (doc.is_spam == false) {
                    response.access = true;
                    let user = {
                      name: doc.full_name,
                      email: doc.email,
                      phone: doc.phone,
                      password: doc.new_password,
                    };
                    let accessToken = jwt.sign(
                      user,
                      process.env.ACCESS_SECRET_TOKEN,
                      {
                        expiresIn: "15m",
                      }
                    );
                    let refreshToken = jwt.sign(
                      user,
                      process.env.REFRESH_SECRET_TOKEN,
                      {
                        expiresIn: "14d",
                      }
                    );
                    response.accessToken = accessToken;
                    response.refreshToken = refreshToken;
                    response.otp_verified = false;
                    res.status(200).json(response);
                  } else {
                    response.access = false;
                    res.status(401).json("blocked user");
                  }
                } else {
                  response.password = false;
                  res.status(404).json("Username or password incorrect!");
                }
              }
            });
          } else {
            response.email = false;
            res.status(404).json("Username or password incorrect!");
          }
        })
        .catch((err) => {
          console.log("database error! ", err);
        });
    } catch (error) {
      console.log("login error!", error);
    }
  },

  // to get user data
  getUserData: async (req, res) => {
    try {
      let result;
      const query = req.query.str;
      if (query) {
        console.log("q: ", query);
        if (!result) {
          result = await User.findById(query).exec();
        }
      } else {
        result = req.user;
      }
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("invalid username or id!");
      }
      console.log("result*********: ", result);
    } catch (error) {
      res.status(404).json(error);
    }
  },

  // generate new token:
  genarateToken: async (req, res) => {
    try {
      let oldToken = req.query.token;
      let decoded = jwt.decode(oldToken);
      let user = await User.findOne({ email: decoded.email });
      let newToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: "20m" }
      );
      res.status(200).json(newToken);
    } catch (error) {
      res.status(404).json(error);
    }
  },

  //otp genarating:
  genarateOtp: async (req, res) => {
    try {
      let email = req.user.email;
      // Generate random OTP
      const OTP = randomstring.generate({
        length: 6,
        charset: "numeric",
      });
      console.log("OTP: ", OTP);

      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        debug: true,
        service: "Outlook",
        auth: {
          user: process.env.SERVICE_EMAIL,
          pass: process.env.SERVICE_PASSWORD,
        },
      });
      // Create message object
      const message = {
        from: "codeboxofficial@outlook.com",
        to: email,
        subject: "OTP Verification",
        html: `<pre style="font-family:'sans-serif';color:black;">Dear ${req.user.full_name},
        Thank you for using Codebox. To complete your authentication process, please find your One-Time Password (OTP) details below:

        OTP Code: <b>${OTP}</b>
        Expiration Time: 3 Minutes
        Verify here: <a href="${process.env.URL}/user/otp">${process.env.URL}/user/otp</a>
        
        <p style="color:black;">Please note that this OTP is valid for a limited time only and should be used for immediate verification. 
        Do not share this OTP with anyone, including Codebox support representatives. We will never ask you for your OTP.
        Thank you for choosing Codebox. We appreciate your trust.</p></pre>`,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          // Retry sending the email after a delay (e.g., 5 seconds)1
          const retryDelay = 4000;
          setTimeout(() => {
            transporter.sendMail(message, (retryErr, retryInfo) => {
              console.log("retry sending..");
              if (retryErr) {
                console.log("Retry error: ", retryErr);
                res.status(404).json({ error: "Failed to send OTP email" });
              } else {
                emailSent(retryInfo, res, email, OTP);
              }
            });
          }, retryDelay);
        } else {
          emailSent(info, res, email, OTP);
        }
      });
    } catch (error) {
      console.log("catch error: ", error);
    }
  },

  // otp verification:
  verifyOtp: async (req, res) => {
    try {
      console.log("req.body: ", req.body);
      console.log("req.user: ", req.user);
      let email = req.user.email;
      let otp = req.body.otp;
      console.log("otp: ", otp);
      let user = await User.findOne({ email: email });
      console.log("user: ", user);
      if (user.user_otp.otp == otp) {
        console.log("otp correct");
        let expireDate = user.user_otp.expiresIn;
        let nowDate = new Date();
        console.log("expire date: ", expireDate);
        console.log("today date: ", nowDate);
        if (nowDate < expireDate) {
          user
            .updateOne({ $set: { otp_verified: true } })
            .then((data) => {
              console.log("Otp verified successfully ", data);
              res.status(200).json({ valid: true, expired: false });
            })
            .catch((err) => {
              console.log("Otp verified failed! ", err);
            });
        } else {
          res.status(200).json({ valid: false, expired: true });
          console.log("otp expired");
        }
      } else {
        res.status(200).json({ valid: false });
        console.log("Otp verification failed!");
      }
    } catch (error) {
      res.status(404).json({ valid: false });
      console.log("error verifyOtp!! ", error);
    }
  },
};

// Send message using the transporter
const emailSent = async (emailInfo, res, email, OTP) => {
  try {
    let beginTime = new Date();
    let expiresIn = new Date(beginTime.getTime() + 3 * 60000);
    // expiresIn.setMinutes(expiresIn.getMinutes() + 3);
    console.log("beginTime: ", beginTime);
    console.log("expiresIn: ", expiresIn);
    let userData = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          "user_otp.otp": OTP,
          "user_otp.isGenerated": true,
          "user_otp.beginsIn": beginTime,
          "user_otp.expiresIn": expiresIn,
        },
      },
      { new: true }
    );
    if (userData) {
      console.log("success response from database: ", userData);
      let otpData = userData.user_otp;
      console.log("otp data: ", otpData);
      res.status(200).json({
        beginTime: otpData.beginsIn,
        expiresIn: otpData.expiresIn,
        isGenerated: otpData.isGenerated,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};
