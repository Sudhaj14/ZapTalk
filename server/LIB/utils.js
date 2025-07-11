const jwt = require("jsonwebtoken");

// Function to generate a token for a user
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

module.exports = {
  generateToken,
};
