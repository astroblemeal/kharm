import jwt from "jsonwebtoken";

// *****
// SIGN
// *****

export function signToken(uid) {
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// *****
// AUTHENTICATE
// *****

export function authBearerToken(request) {
  let authError = false;
  let auth = undefined;

  try {
    const token = request.headers.authorization.split(" ")[1];
    auth = jwt.verify(token, process.env.JWT_SECRET);

    if (!auth) {
      authError = "Unauthorized - invalid token";
    }
  } catch (error) {
    authError = "Unauthorized - invalid token";
  }

  return { auth, authError };
}
