import { initMiddleware } from "../../../middleware/helpers";
import connectDB from "../../../config/mongodb";
// import { authBearerToken } from "../../../middleware/jsonwebtoken";
import Session from "../../../models/Session";

initMiddleware(connectDB());

export default async (request, response) => {
  switch (request.method) {
    case "GET":
      {
        try {
          //   const { auth, authError } = authBearerToken(request);
          //   if (authError) return response.status(401).json({ error: true, message: authError });

          const foundSessions = await Session.find({});

          response.status(200).json({
            message: "Fetched feed",
            feed: foundSessions,
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
