import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sender: {
        id: String,
        username: String
    },
    reply: {
        replied: Boolean,
        content: String || null
    },
    recipient: String,
    recipientUsername: String,
    sentTimestamp: Number,
    subject: String,
    message: String,
    read: Boolean
});

const mailModel = mongoose.model("mails", mailSchema);

export { mailModel };