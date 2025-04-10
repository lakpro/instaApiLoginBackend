const axios = require("axios");

// controllers/profileController.js
exports.getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.user);
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const accessToken = req.user?.accessToken;
    // try {
    const response = await axios.get("https://graph.instagram.com/v22.0/me", {
      params: {
        fields:
          "id,username,name,account_type,media_count,profile_picture_url,followers_count,follows_count",
        access_token: accessToken,
      },
    });
    // console.log("Profile response:", response);
    // } catch (err) {
    //   console.error(
    //     "Error fetching profile:",
    //     err.response?.data || err.message
    //   );
    //   return res.status(500).json({ error: "Failed to fetch profile" });
    // }

    console.log("Profile response data:", response.data);

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// controllers/profileController.js
exports.getMedia = async (req, res) => {
  try {
    const accessToken = req.user?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    // STEP 1: Get the user's IG ID
    const userInfo = await axios.get("https://graph.instagram.com/v22.0/me", {
      params: {
        fields: "id,username",
        access_token: accessToken,
      },
    });

    const igUserId = userInfo.data.id;

    // STEP 2: Get the user's media
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

    console.log("Media response:", mediaResponse.data);

    res.status(200).json(mediaResponse.data.data); // Send media array
  } catch (err) {
    console.error("Error fetching media:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Instagram media." });
  }
};
