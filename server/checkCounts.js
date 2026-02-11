const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Driver = require('./models/Driver');
const Route = require('./models/Route');
const Maintenance = require('./models/Maintenance');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const routes = await Route.countDocuments();
        const drivers = await Driver.countDocuments();
        const buses = await Bus.countDocuments();
        const maintenance = await Maintenance.countDocuments();
        console.log(`Routes: ${routes}`);
        console.log(`Drivers: ${drivers}`);
        console.log(`Buses: ${buses}`);
        console.log(`Maintenance: ${maintenance}`);
        process.exit(0);
    });
