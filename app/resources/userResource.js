class UserResource {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.createdAt = user.createdAt.toDateString();
        this.updatedAt = user.updatedAt.toDateString();
    }
}

export default UserResource;