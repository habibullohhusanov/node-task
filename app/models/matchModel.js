import mongoose from "mongoose";

const Schema = mongoose.Schema;

const matches = Schema(
    {
        tournamentsId: {
            type: Schema.Types.ObjectId,
            ref: "Tournament",
            required: true,
        },
        playerOne: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            required: true,
        },
        playerTwo: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            required: true,
        },
        round: {
            type: Number,
            default: 1,
        },
        won: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

const Match = mongoose.model("Match", matches);
export default Match;