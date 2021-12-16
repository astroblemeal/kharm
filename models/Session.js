import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const Session = new Schema({
  main_category: { type: String, required: true },
  sub_category: { type: String, required: true },
  date_and_time: { type: Date, required: true },
  host: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "Account" }],
});

export default models.Session ?? model("Session", Session);
