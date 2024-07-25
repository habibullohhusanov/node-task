import cron from "node-cron";
import express from "express";
import connect from "./config/dbConfig.js";
import authRoute from "./routes/authRoute.js";
import Match from "./app/models/matchModel.js";
import adminRoute from "./routes/admin/adminRoute.js";
import userDataRoute from "./routes/userDataRoute.js";
import Tournament from "./app/models/tournamentModel.js";
import userAdminRoute from "./routes/admin/userRoute.js";
import tournamentRoute from "./routes/tournamentRoute.js";
import { getTime, isoDate, shortDate, utcDate } from "./uitls/date.js";
import tournamentAdminRoute from "./routes/admin/tournamentAdminRoute.js";

// .env
const PORT = process.env.PORT;
const URL = process.env.URL;

// start
const app = express();

// middlwares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes

app.use("/auth", authRoute);
app.use("/user", userDataRoute);
app.use("/admin/admins", adminRoute);
app.use("/api/tournaments", tournamentRoute);
app.use("/admin/tournaments", tournamentAdminRoute);
app.use("/admin/users", userAdminRoute);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: [],
        message: "Working"
    });
});

// cron
/*
const populate = [
    { path: "owner" },
    {
        path: "participants",
        populate: "userId",
    }
];

cron.schedule("5 * * * *", async () => {
    try {
        const now = new Date();

        const tournaments = await Tournament.find({
            status: 'active',
            startAt: { $lte: now },
        }).populate(populate);

        for (const tournament of tournaments) {
            await generateSwissPairings(tournament);

            tournament.status = 'continues';
            await tournament.save();
        }
        console.log("TTT");
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

async function generateSwissPairings(tournament) {
    const participants = tournament.participants;

    const pairings = [];
    for (let i = 0; i < participants.length; i += 2) {
        if (i + 1 < participants.length) {
            pairings.push([participants[i], participants[i + 1]]);
        }
    }

    for (const [playerOne, playerTwo] of pairings) {
        const match = new Match({
            tournamentsId: tournament._id,
            playerOne: playerOne._id,
            playerTwo: playerTwo._id,
            round: 1,
        });
        await match.save();
    }
}
*/
// end cron

// end
app.listen(PORT, () => {
    connect();
    console.log(`Started ${URL}:${PORT}`);
});