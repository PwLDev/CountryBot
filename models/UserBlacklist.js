import mongoose from "mongoose";

const userBlacklistSchema = new mongoose.Schema({
    _id: String
});

const userBlacklistModel = mongoose.model("user-blacklist", userBlacklistSchema);

export { userBlacklistModel };