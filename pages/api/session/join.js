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

          // verify not a participant
          if (foundSession.participants.includes(auth.uid)) {
            return response.status(400).json({
              error: true,
              message: "Already joined this session",
            });
          }

          // verify not a host
          if (foundSession.host.equals(auth.uid)) {
            return response.status(400).json({
              error: true,
              message: "You are host of this session",
            });
          }

          // verify max 5 participants
          if (foundSession.participants.length == 5) {
            return response.status(400).json({
              error: true,
              message: "This session is full",
            });
          }

          // verify not in the past
          if (new Date(foundSession.date_and_time) < new Date()) {
            return response.status(400).json({
              error: true,
              message: "Cannot join a session in the past",
            });
          }

          // add account to session-participants
          foundSession.participants.push(auth.uid);
          await foundSession.save();

          // add session to account
          let foundAccount = await Account.findOne({ _id: auth.uid });
          foundAccount.sessions.push(foundSession._id);
          await foundAccount.save();
          // populate sessions
          foundAccount = await Account.populate(foundAccount, { path: "sessions" });

          response.status(200).json({
            message: "Joined session",
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
