const bcrypt = require('bcrypt');
const { db } = require('../../utils/db');

function findUserByEmail(email) {
    return db.users.findUnique({
        where: {
            Email: email,
        },
    });
}

function findUserByUsername(username) {
    return db.users.findFirst({
        where: {
            Username: username,
        },
    });
}

function createUser(user) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    const currentDate = new Date();

    return db.users.create({
        data: {
            Username: user.username,
            Password: hashedPassword,
            Email: user.email,
            CreationDate: currentDate,
            IsActive: true,
        }
    });
}

function findUserById(id) {
    return db.users.findUnique({
        where: {
            UserID: id,
        },
    });
}

module.exports = {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser
};