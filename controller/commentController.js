// controllers/commentController.js
const axios = require("axios");

exports.getComments = async (req, res) => {
  console.log("in comments controller");
  // console.log("req in comments", req);
  const MEDIA_ID = req.params.mediaId;
  console.log("mediaId:", MEDIA_ID);
  const accessToken = req.user?.accessToken; // Assuming you have auth middleware
  console.log("accessToken:", accessToken);
  if (!MEDIA_ID || !accessToken) {
    return res.status(400).json({ error: "Missing media ID or access token." });
  }

  try {
    console.log("fetching comments...");
    const url = `https://graph.instagram.com/v22.0/${MEDIA_ID}/comments`;
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        fields: "from,parent_id,text,timestamp,username",
      },
    });

    console.log("Comments response:", response.data);

    res.status(200).json(response.data);
  } catch (err) {
    console.error(
      "Error fetching comments:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

exports.replyToComment = async (req, res) => {
  console.log("Req", req);
  const { comment_id, message } = req.body;
  const accessToken = req.user?.accessToken;

  console.log("comment_id:", comment_id);
  console.log("message:", message);
  console.log("accessToken:", accessToken);

  console.log("trying to reply to  comment");

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

    console.log("Reply response:", response.data);

    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    console.error("Comment reply error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
};
