const axios = require("axios");
const qs = require("qs");
const { generateJWT } = require("../utils/jwt");
const dotenv = require("dotenv");
dotenv.config();

const IG_APP_ID = process.env.IG_APP_ID;
const IG_APP_SECRET = process.env.IG_APP_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

exports.login = (req, res) => {
  const scopes = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
    "instagram_business_content_publish",
  ].join(",");

  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${IG_APP_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopes}&response_type=code`;

  res.redirect(authUrl);
};

exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });

  res.redirect(FRONTEND_URL);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided." });
  }

  try {
    const shortTokenRes = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify({
        client_id: IG_APP_ID,
        client_secret: IG_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token: shortToken, user_id: userId } = shortTokenRes.data;

    const longTokenRes = await axios.get(
      `https://graph.instagram.com/access_token`,
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: IG_APP_SECRET,
          access_token: shortToken,
        },
      }
    );

    const longLivedToken = longTokenRes.data.access_token;

    const jwtToken = generateJWT(longLivedToken, userId);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true, // use HTTPS
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });

    res.redirect(`${FRONTEND_URL}/profile`);
  } catch (error) {
    console.error(
      "Token exchange error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to exchange token." });
  }
};
