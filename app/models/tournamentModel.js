import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tournaments = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "continues", "inactive"],
            default: "active",
            required: true
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "Player",
            }
        ],
        startAt: {
            type: Date,
            default: Date.now(),
        },
        finishAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Tournament = mongoose.model("Tournament", tournaments);
export default Tournament;