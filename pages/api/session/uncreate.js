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

          // verify is session host
          if (!foundSession.host.equals(auth.uid)) {
            return response.status(400).json({
              error: true,
              message: "You are not the session host",
            });
          }

          // remove session from participants accounts
          for (let i = 0; i < foundSession.participants.length; i++) {
            const participant = foundSession.participants[i];
            const foundParticipant = await Account.findOne({ _id: participant });
            foundParticipant.sessions.splice(
              foundParticipant.sessions.findIndex((sessionId) => sessionId.equals(session_id)),
              1,
            );
            await foundParticipant.save();
          }
          // remove session from host account
          let foundHost = await Account.findOne({ _id: foundSession.host });
          foundHost.sessions.splice(
            foundHost.sessions.findIndex((sessionId) => sessionId.equals(session_id)),
            1,
          );
          await foundHost.save();
          // populate sessions
          foundHost = await Account.populate(foundHost, { path: "sessions" });

          // delete the session
          await Session.deleteOne({ _id: session_id });

          response.status(200).json({
            message: "Deleted session",
            sessionId: session_id,
            account: foundHost,
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
