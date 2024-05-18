import mongoose from "mongoose";

const premiumSchema = new mongoose.Schema({
    user: String,
    end: Number
});

const premiumModel = mongoose.model("premium", premiumSchema);

export { premiumModel };