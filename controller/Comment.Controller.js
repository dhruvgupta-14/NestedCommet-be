import Comment from "../model/comment.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";
export async function getNestedComments(req, res) {
  try {
    // 1️⃣ Get all comments
    const comments = await Comment.find().sort({ created_at: 1 }).lean();

    // 2️⃣ Get all users whose IDs appear in comments
    const userIds = [...new Set(comments.map(c => c.user_id))];
    const users = await User.find({ id: { $in: userIds } }).lean();

    // 3️⃣ Create a map of user_id -> user info
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = {
        name: user.name,
        avatar: user.avatar,
      };
    });

    // 4️⃣ Attach user info to comments
    comments.forEach(comment => {
      const user = userMap[comment.user_id];
      comment.user = user
        ? user
        : { name: "Unknown", avatar: null };
      comment.children = [];
    });

    // 5️⃣ Build nested structure
    const commentMap = {};
    comments.forEach(comment => {
      commentMap[comment.id] = comment;
    });

    const nestedComments = [];
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap[comment.parent_id];
        if (parent) parent.children.push(comment);
      } else {
        nestedComments.push(comment);
      }
    });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: nestedComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
}



export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

