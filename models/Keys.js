import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
    key: String,
    claimed: Boolean,
    end: Number
});

const keyModel = mongoose.model("keys", keySchema);

export { keyModel };