import { initMiddleware } from "../../../middleware/helpers";
import connectDB from "../../../config/mongodb";
import { authBearerToken } from "../../../middleware/jsonwebtoken";
import Session from "../../../models/Session";
import Account from "../../../models/Account";

initMiddleware(connectDB());

export default async (request, response) => {
  switch (request.method) {
    case "POST":
      {
        try {
          const { auth, authError } = authBearerToken(request);
          if (authError) return response.status(401).json({ error: true, message: authError });

          const { session_id } = request.body;
          // field is required
          if (!session_id) {
            return response.status(400).json({
              error: true,
              message: "Please enter all required fields",
              required_fields: ["session_id"],
            });
          }

          // verify session existance
          const foundSession = await Session.findOne({ _id: session_id });
          if (!foundSession) {
            return response.status(404).json({
              error: true,
              message: "Could not find a session with that ID",
            });
          }

          // verify is a participant
          if (!foundSession.participants.includes(auth.uid)) {
            return response.status(400).json({
              error: true,
              message: "You are not in this session",
            });
          }

          // remove account from session-participants
          foundSession.participants.splice(
            foundSession.participants.findIndex((accountId) => accountId.equals(auth.uid)),
            1,
          );
          await foundSession.save();

          // remove session from account
          let foundAccount = await Account.findOne({ _id: auth.uid });
          foundAccount.sessions.splice(
            foundAccount.sessions.findIndex((sessionId) => sessionId.equals(foundSession._id)),
            1,
          );
          await foundAccount.save();
          // populate sessions
          foundAccount = await Account.populate(foundAccount, { path: "sessions" });

          response.status(200).json({
            message: "Left session",
            session: foundSession,
            account: foundAccount,
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
