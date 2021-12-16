import { initMiddleware } from "../../../middleware/helpers";
import connectDB from "../../../config/mongodb";
import { authBearerToken } from "../../../middleware/jsonwebtoken";
import Session from "../../../models/Session";
import Account from "../../../models/Account";

initMiddleware(connectDB());

export default async (request, response) => {
  switch (request.method) {
    case "GET":
      {
        try {
          const { auth, authError } = authBearerToken(request);
          if (authError) return response.status(401).json({ error: true, message: authError });

          // get session data
          const { session_id } = request.query;
          const foundSession = await Session.findOne({ _id: session_id });

          // verify session existance
          if (!foundSession) {
            return response.status(404).json({
              error: true,
              message: "Could not find a session with that ID",
            });
          }

          // verify requester is host / participant
          if (!foundSession.host == auth.uid && !foundSession.participants.includes(auth.uid)) {
            return response.status(401).json({
              error: true,
              message: "You are not part of this session",
            });
          }

          response.status(200).json({
            message: "Fetched session",
            session: await Session.populate(foundSession, { path: "host participants" }),
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
