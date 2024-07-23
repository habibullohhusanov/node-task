import express from "express";
import connect from "./config/dbConfig.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/admin/adminRoute.js";
import userDataRoute from "./routes/userDataRoute.js";
import userAdminRoute from "./routes/admin/userRoute.js";
import tournamentRoute from "./routes/tournamentRoute.js";
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

// end
app.listen(PORT, () => {
    connect();
    console.log(`Started ${URL}:${PORT}`);
});