import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    company: String,
    notes: String,
    image: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
