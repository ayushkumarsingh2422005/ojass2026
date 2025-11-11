import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPrizes {
  total: string;
  winner: string;
  first_runner_up: string;
  second_runner_up: string;
  [key: string]: string | undefined;
}

export interface IEventHead {
  name: string;
  Phone: string;
}

export interface IEvent extends Document {
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean; // flag for team or individual event
  img: string;
  rulebookurl: string;
  redirect: string;
  organizer?: string;
  description: string;
  prizes: IPrizes;
  details: string[];
  rules: string[];
  event_head: IEventHead;
  winners: mongoose.Types.ObjectId[];
}

const prizesSchema = new Schema<IPrizes>(
  {
    total: { type: String, required: true },
    winner: { type: String, required: true },
    first_runner_up: { type: String, required: true },
    second_runner_up: { type: String, required: true }
  },
  { _id: false }
);

const eventHeadSchema = new Schema<IEventHead>(
  {
    name: { type: String, required: true },
    Phone: { type: String, required: true },
  },
  { _id: false }
);

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    teamSizeMin: {
      type: Number,
      required: [true, "Minimum team size is required"],
      min: [1, "Minimum team size must be at least 1"],
    },
    teamSizeMax: {
      type: Number,
      required: [true, "Maximum team size is required"],
      min: [1, "Maximum team size must be at least 1"],
      validate: {
        validator: function (this: IEvent, v: number) {
          return v >= this.teamSizeMin;
        },
        message: "Maximum team size must be greater than or equal to minimum team size",
      },
    },
    isTeamEvent: {
      type: Boolean,
      required: [true, "Event type flag (isTeamEvent) is required"],
      // Optionally, add a default: false for backward-compatibility if needed
    },
    img: {
      type: String,
      required: [true, "Event image is required"],
      trim: true,
    },
    rulebookurl: {
      type: String,
      required: [true, "Rulebook URL is required"],
      trim: true,
    },
    redirect: {
      type: String,
      required: [true, "Redirect path is required"],
      trim: true,
    },
    organizer: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    prizes: {
      type: prizesSchema,
      required: [true, "Prize information is required"],
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
    event_head: {
      type: eventHeadSchema,
      required: [true, "Event head information is required"],
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

eventSchema.index({ id: 1 });
eventSchema.index({ name: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
