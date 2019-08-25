const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * Comment fields:
 * - text
 * - createdAt
 */
const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;