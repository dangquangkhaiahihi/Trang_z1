const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
    findUserByEmail,
    createUser,
    findUserById,
    findUserByUsername
} = require('../users/users.services');
const { generateTokens } = require('../../utils/jwt');
const {
    addRefreshTokenToWhitelist,
    findRefreshTokenById,
    deleteRefreshToken,
    revokeTokens
} = require('./auth.services');
const { hashToken } = require('../../utils/hashToken');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!email || !password || !username) {
            res.status(400);
            throw new Error('You must provide an email and a password and an username.');
        }

        const existingEmail = await findUserByEmail(email);
        const existingUsername = await findUserByUsername(email);

        if (existingEmail) {
            res.status(400);
            throw new Error('Email already in use.');
        }

        if (existingUsername) {
            res.status(400);
            throw new Error('Username already in use.');
        }

        const user = await createUser({ username, email, password });
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.UserID });

        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('You must provide an email and a password.');
        }

        const existingUser = await findUserByEmail(email);

        if (!existingUser) {
            res.status(403);
            throw new Error('Invalid login credentials email.');
        }

        const validPassword = await bcrypt.compare(password, existingUser.Password);
        if (!validPassword) {
            res.status(403);
            throw new Error('Invalid login credentials password.');
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.UserID });

        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
});

// The refresh_token endpoint is used to get another pair of tokens,
// in order to keep the user logged.
// We check if the sent refresh token is valid and if it is in our database.
// If those conditions are met, we invalidate the previous refresh token and generate a new pair of tokens.
router.post('/refreshToken', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Missing refresh token.');
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = await findRefreshTokenById(payload.jti);

        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const hashedToken = hashToken(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const user = await findUserById(payload.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.UserID });

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
});

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)

// The /revokeRefreshTokens should not be exposed in the api.
// You should call the revokeTokens method only in a specific
// case where you would like to invalidate all the tokens ( ex: password reset ).
router.post('/revokeRefreshTokens', async (req, res, next) => {
    try {
        const { userId } = req.body;
        await revokeTokens(parseInt(userId));
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;