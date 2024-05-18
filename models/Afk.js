import mongoose from "mongoose";

const afkSchema = new mongoose.Schema({
    _id: String,
    reason: String
});

const afkModel = mongoose.model("keys", afkSchema);

export { afkModel };