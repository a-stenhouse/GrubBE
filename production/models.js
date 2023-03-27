

exports.fetchUsers = () => {
    return User.find();
}

exports.fetchUser = (username) => {
    return User.find(username);
}

exports.fetchItems = () => {
    return Item.find();
}

exports.fetchItem = (_id) => {
    return Item.find(_id);
}

exports.createUser = ({ username, password, location, contact_details }) => {
    const salt = crypto.randomBytes(16);
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex");
    const newUser = new User({ username, password: hashedPassword, salt, location, contact_details });
    return newUser.save();
}