import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ original working behavior: store user id
    req.user = decoded.id;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Token invalid" });
  }
};