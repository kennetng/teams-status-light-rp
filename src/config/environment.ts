const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    REDIRECT_URL: process.env.REDIRECT_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    PORT: process.env.PORT
};