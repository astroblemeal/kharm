import { initMiddleware } from "../../../middleware/helpers";
import connectDB from "../../../config/mongodb";
import bcrypt from "bcrypt";
import { authBearerToken, signToken } from "../../../middleware/jsonwebtoken";
import Account from "../../../models/Account";

initMiddleware(connectDB());

export default async (request, response) => {
  switch (request.method) {
    case "POST":
      {
        try {
          const { username, password } = request.body;

          // some fields are required
          if (!username || !password) {
            return response.status(400).json({
              error: true,
              message: "Please enter all required fields",
              required_fields: ["username", "password"],
            });
          }

          // verify username exists
          const foundAccount = await Account.findOne({ username }).populate("sessions");
          if (!foundAccount) {
            return response.status(400).json({
              error: true,
              message: "Bad credentials",
            });
          }

          // verify password
          const verifiedPass = await bcrypt.compare(password, foundAccount.passwordHash);
          if (!verifiedPass) {
            return response.status(400).json({
              error: true,
              message: "Bad credentials",
            });
          }

          // generate token
          const token = signToken(foundAccount._id);

          response.status(200).json({
            message: "Signed in",
            account: foundAccount,
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

    case "GET":
      {
        try {
          const { auth, authError } = authBearerToken(request);
          if (authError) return response.status(401).json({ error: true, message: authError });

          // verify username exists
          const foundAccount = await Account.findOne({ _id: auth.uid }).populate("sessions");
          if (!foundAccount) {
            return response.status(404).json({
              error: true,
              message: "Account not found",
            });
          }

          // generate token
          const token = signToken(foundAccount._id);

          response.status(200).json({
            message: "Signed in",
            account: foundAccount,
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
