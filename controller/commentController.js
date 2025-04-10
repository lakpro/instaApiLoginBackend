// controllers/commentController.js
const axios = require("axios");

exports.getComments = async (req, res) => {
  const MEDIA_ID = req.params.mediaId;
  const accessToken = req.user?.accessToken;

  if (!MEDIA_ID || !accessToken) {
    return res.status(400).json({ error: "Missing media ID or access token." });
  }

  try {
    const url = `https://graph.instagram.com/v22.0/${MEDIA_ID}/comments`;
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        fields: "from,parent_id,text,timestamp,username",
      },
    });

    res.status(200).json(response.data.data);
  } catch (err) {
    console.error(
      "Error fetching comments:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

exports.replyToComment = async (req, res) => {
  const { comment_id, message } = req.body;
  const accessToken = req.user?.accessToken;

  if (!comment_id || !message) {
    return res.status(400).json({ error: "Comment ID and message required" });
  }

  try {
    const response = await axios.post(
      `https://graph.instagram.com/v22.0/${comment_id}/replies?message={message}`,
      null,
      {
        params: {
          message,
          access_token: accessToken,
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    console.error("Comment reply error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};
