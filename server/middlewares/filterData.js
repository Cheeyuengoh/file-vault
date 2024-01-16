const User = require("../models/userModel");

const filterEmails = async (req, res, next) => {
    const { emails } = req.body;

    let filtered = {
        validUsers: [],
        invalidUsers: []
    }

    for (const email of emails) {
        try {
            const user = await User.getUserByEmail(email);
            filtered.validUsers.push(user);
        } catch (err) {
            filtered.invalidUsers.push(email);
            continue;
        }
    }

    req.filtered = filtered;
    next();
}

module.exports = { filterEmails };