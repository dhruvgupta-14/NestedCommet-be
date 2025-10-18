import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  // sequential comment ID (like your 'id' field)
  id: {
    type: Number,
    unique: true,
    required: true,
  },

  parent_id: {
    type: Number, // refers to another comment's id
    default: null,
  },

  text: {
    type: String,
    required: true,
  },

  upvotes: {
    type: Number,
    default: 0,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  user_id: {
    type: String,
    ref: "User", // link to user model
    required: true,
  },
});

// ✅ Middleware: Automatically set incremental `id` value
commentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastComment = await mongoose
      .model("Comment")
      .findOne({}, {}, { sort: { id: -1 } });
    this.id = lastComment ? lastComment.id + 1 : 1;
  }
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
