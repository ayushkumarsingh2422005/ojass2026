import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPrizeWorth {
  Total: string;
  Winner: string;
  FirstRunnerUp: string;
  SecondRunnerUp: string;
  [key: string]: string;
}

export interface IEvent extends Document {
  title: string;
  bannerImage: string;
  maxTeamSize: number;
  isIndividual: boolean;
  description: string[];
  prizeWorth: IPrizeWorth;
  details: string[];
  rules: string[];
  eventHeads: string[];
  contactNo: string[];
  winners: mongoose.Types.ObjectId[];
}

const prizeWorthSchema = new Schema<IPrizeWorth>(
  {
    Total: { type: String, required: true },
    Winner: { type: String, required: true },
    FirstRunnerUp: { type: String, required: true },
    SecondRunnerUp: { type: String, required: true },
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    bannerImage: {
      type: String,
      required: [true, "Banner image is required"],
      trim: true,
    },
    maxTeamSize: {
      type: Number,
      required: [true, "Team size is required"],
    },
    isIndividual: {
      type: Boolean,
      required:[true, "Specify if the event is an individual or team event"],
    },
    description: {
      type: [String],
      required: [true, "Description is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Description must have at least one item",
      },
    },
    prizeWorth: {
      type: prizeWorthSchema,
      required: [true, "Prize worth information is required"],
    },
    details: {
      type: [String],
      required: [true, "Event details are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Details must have at least one item",
      },
    },
    rules: {
      type: [String],
      required: [true, "Event rules are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Rules must have at least one item",
      },
    },
    eventHeads: {
      type: [String],
      required: [true, "Event heads are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one event head is required",
      },
    },
    contactNo: {
      type: [String],
      required: [true, "Contact numbers are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one contact number is required",
      },
    },
    winners: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
      default: [],
      validate: {
        validator: (v: mongoose.Types.ObjectId[]) => v.length <= 3,
        message: "Winners array cannot have more than 3 entries",
      },
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ title: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
