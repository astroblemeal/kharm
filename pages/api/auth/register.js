import { initMiddleware } from "../../../middleware/helpers";
import connectDB from "../../../config/mongodb";
import bcrypt from "bcrypt";
import { signToken } from "../../../middleware/jsonwebtoken";
import Account from "../../../models/Account";

initMiddleware(connectDB());

export default async (request, response) => {
  switch (request.method) {
    case "POST":
      {
        try {
          const { displayName, username, password, confirmPassword, profession } = request.body;

          // some fields are required
          if (!displayName || !username || !password || !confirmPassword) {
            return response.status(400).json({
              error: true,
              message: "Please enter all required fields",
              required_fields: ["displayName", "username", "password", "confirmPassword"],
              optional_fields: ["profession"],
            });
          }

          // verify unique username
          const accountExists = await Account.findOne({ username });
          if (accountExists) {
            return response.status(400).json({
              error: true,
              message: "That username is already taken",
            });
          }

          // verify password match
          if (password != confirmPassword) {
            return response.status(400).json({
              error: true,
              message: "Passwords do not match",
            });
          }

          // hash the password
          const salt = await bcrypt.genSalt();
          const hash = await bcrypt.hash(password, salt);

          // create new user
          const newAccount = await Account.create({
            display_name: displayName,
            username,
            passwordHash: hash,
            profession: profession ?? "Anonymous",
          });

          // generate token
          const token = signToken(newAccount._id);

          response.status(201).json({
            message: "Signed up",
            account: newAccount,
            token,
          });
        } catch (error) {
          console.log(error);
          response.status(500).json({
            error: true,
            message: error.message,
          });
        }
      }
      break;

    default:
      response.status(404).json({ error: true, message: "Invalid request method" });
      break;
  }
};
