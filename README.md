## Use

### 1. Download the project

### 2. Install all packgages
```
npm install
```

### 3.
**Rename the .env.example file to .env .**
<br/>
**Enter a base link .**

### 4. Run seeder
```
npm run seed
```

Code : *userSeeder.js*
```
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
```

### 5. Run developer mode
```
npm run dev
```


**The project runs on port 5000 at http://localhost**
### http://localhost:5000


## Documentation
[https://documenter.getpostman.com/view/30485454/2sA3kYhJyK](https://documenter.getpostman.com/view/30485454/2sA3kYhJyK)

## Packages
+ bcryptjs         2.4.3
+ express         4.19.2
+ joi         17.12.3
+ jsonwebtoken         9.0.2
+ mongoose         8.3.2
+ nodemon         3.1.0
+ node-corn        3.0.3


## File structure

```
express-template
.
├── app
│   ├── controllers
│   │   ├── admin
│   │   │   ├── adminController.js
│   │   │   ├── tournamentController.js
│   │   │   └── userController.js
│   │   ├── authController.js
│   │   ├── tournamentController.js
│   │   └── userDataController.js
│   ├── middlewares
│   │   ├── adminMiddlewares.js
│   │   ├── authMiddlewares.js
│   │   └── superAdminMiddlewares.js
│   ├── models
│   │   ├── matchModel.js
│   │   ├── playerModel.js
│   │   ├── tournamentModel.js
│   │   └── userModel.js
│   ├── requests
│   │   ├── authRequst.js
│   │   └── tournamentRequst.js
│   └── resources
│   │   ├── playerResource.js
│   │   ├── playerWithResource.js
│   │   ├── tournamentResource.js
│   │   ├── userResource.js
│       └── userWithResource.js
├── config
│   └── dbConfig.js
├── routes
│   ├── admin
│   │   ├── adminRoute.js
│   │   ├── tournamentAdminRoute.js
│   │   └── userRoute.js
│   ├── authRoute.js
│   ├── tournamentRoute.js
│   └── userDataRoute.js
├── seeders
│   ├── index.js
│   └── userSeeder.js
├── uilts
│   ├── date.js
│   └── response.js
├── .env.example
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```
