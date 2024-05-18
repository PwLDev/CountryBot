import mongoose from "mongoose";

const guildBlacklistSchema = new mongoose.Schema({
    _id: String
});

const guildBlacklistModel = mongoose.model("guild-blacklist", guildBlacklistSchema);

export { guildBlacklistModel };