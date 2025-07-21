import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
});

const voteSchema = new mongoose.Schema({
  userId: String,
  optionIndex: Number,
});

const pollSchema = new mongoose.Schema(
  {
    question: String,
    options: [optionSchema],
    votes: [voteSchema], // ✅ Add this line
  },
  { timestamps: true }
);

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
