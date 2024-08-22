const Mongoose = require("mongoose");

const feedbackSchema = new Mongoose.Schema({
  username: { type:String, required: true },
  feedback: { type:String, required: true },
  received: { type: Date, default: Date.now() },
});
const Feedback = Mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
