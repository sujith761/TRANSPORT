const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { getAnalytics } = require('./controllers/adminController');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const req = { app: { get: () => ({ emit: () => { } }) } };
        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(JSON.stringify(data, null, 2));
                    process.exit(0);
                }
            })
        };
        const next = (err) => {
            console.error(err);
            process.exit(1);
        };
        await getAnalytics(req, res, next);
    });
