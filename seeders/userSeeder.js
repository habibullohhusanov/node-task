import User from "../app/models/userModel.js";

const userSeeder = async () => {
    try {
        await User.deleteMany({});
        var user = new User({
            name: "Admin",
            username: "admin",
            role: "superAdmin",
            email: "admin@gmail.com",
            password: "1234",
        });
        await user.save();
    } catch (error) {
        console.error("User seeder don\'t work:", error);
    }
}

export default userSeeder;