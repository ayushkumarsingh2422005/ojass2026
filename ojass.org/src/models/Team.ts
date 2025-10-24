import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ITeam extends Document {
  eventId: Types.ObjectId;
  isIndividual: boolean;
  teamName?: string;
  teamLeader: Types.ObjectId;
  teamMembers: Types.ObjectId[];
  joinToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    isIndividual: {
      type: Boolean,
      required: true,
      default: false,
    },
    teamName: {
      type: String,
      trim: true,
      required: [
        function (this: ITeam) {
          return !this.isIndividual;
        },
        "Team name is required for team events",
      ],
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team leader is required"],
    },
    teamMembers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: (v: mongoose.Types.ObjectId[]) => v.length > 0,
        message: "Team must have at least one member.",
      },
    },
    joinToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensures one user can only lead one team per event
teamSchema.index({ eventId: 1, teamLeader: 1 }, { unique: true });

// Automatically add the team leader to the team members list if not already present
teamSchema.pre<ITeam>("save", function (next) {
  if (this.isModified("teamLeader") || this.isModified("teamMembers")) {
    const leaderId = this.teamLeader;
    // Check if leader is already in members array using .some() for efficiency
    if (!this.teamMembers.some((memberId) => memberId.equals(leaderId))) {
      this.teamMembers.push(leaderId);
    }
  }
  next();
});

// Validate that no member is already in another team for the *same event*
teamSchema.pre<ITeam>("save", async function (next) {
  if (!this.isModified("teamMembers") && !this.isNew) {
    return next();
  }

  // `this.constructor` refers to the Model ('Team')
  const TeamModel = this.constructor as Model<ITeam>;

  try {
    const conflictingTeam = await TeamModel.findOne({
      eventId: this.eventId,
      _id: { $ne: this._id },
      teamMembers: { $in: this.teamMembers },
    });

    if (conflictingTeam) {
      // Find which members are conflicting
      const conflictingMembers = this.teamMembers.filter((memberId) =>
        conflictingTeam.teamMembers.some((cmId) => cmId.equals(memberId))
      );
      return next(
        new Error(
          `A member (ID: ${conflictingMembers[0]}) is already registered for this event in another team.`
        )
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);

export default Team;
