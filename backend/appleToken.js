const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

function generateAppleDeveloperToken() {
  if (!process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID) {
    throw new Error("APPLE_TEAM_ID et APPLE_KEY_ID sont requis.");
  }

  const privateKey = fs.readFileSync(
    path.join(__dirname, "AuthKey_3DHGA2M8R9.p8"),
    "utf8"
  );

  return jwt.sign(
    {},
    privateKey,
    {
      algorithm: "ES256",
      expiresIn: "180d",
      issuer: process.env.APPLE_TEAM_ID,
      header: {
        alg: "ES256",
        kid: process.env.APPLE_KEY_ID,
      },
    }
  );
}

module.exports = generateAppleDeveloperToken;
