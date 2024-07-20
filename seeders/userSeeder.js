import User from "../app/models/userModel.js";

const userSeeder = async () => {
    try {
        await User.deleteMany({});
        var user = new User({
            name: "Super Admin",
            username: "superadmin",
            role: "superAdmin",
            email: "superadmin@gmail.com",
            password: "1234",
        });
        await user.save();
        var user = new User({
            name: "Admin",
            username: "admin",
            role: "admin",
            email: "admin@gmail.com",
            password: "1234",
        });
        await user.save();
    } catch (error) {
        console.error("User seeder don\'t work:", error);
    }
}

export default userSeeder;