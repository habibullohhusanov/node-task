import mongoose from "mongoose";

const Schema = mongoose.Schema;

const players = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
		rating: {
			type: Number,
            default: 0,
		},
        country: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Player = mongoose.model("Player", players);
export default Player;
