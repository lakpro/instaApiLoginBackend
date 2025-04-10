const axios = require("axios");

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const accessToken = req.user?.accessToken;

    const response = await axios.get("https://graph.instagram.com/v22.0/me", {
      params: {
        fields:
          "id,username,name,account_type,media_count,profile_picture_url,followers_count,follows_count",
        access_token: accessToken,
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const accessToken = req.user?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    // get the user's Instagram user ID
    const userInfo = await axios.get("https://graph.instagram.com/v22.0/me", {
      params: {
        fields: "id,username",
        access_token: accessToken,
      },
    });

    const igUserId = userInfo.data.id;

    // get the user's media
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/v22.0/${igUserId}/media`,
      {
        params: {
          fields:
            "id,caption,media_id,media_url,media_type,timestamp,thumbnail_url,permalink,children{media_url}",
          access_token: accessToken,
        },
      }
    );

    res.status(200).json(mediaResponse.data.data);
  } catch (err) {
    console.error("Error fetching media:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Instagram media." });
  }
};
