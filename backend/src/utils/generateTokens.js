import jwt from "jsonwebtoken";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      userName: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "3d" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      userName: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export { generateTokens };
