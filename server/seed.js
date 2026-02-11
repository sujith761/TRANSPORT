const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Driver = require('./models/Driver');
const Route = require('./models/Route');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    seedData();
}).catch(err => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

const seedData = async () => {
    try {
        // Delete existing data
        await User.deleteMany();
        await Bus.deleteMany();
        await Driver.deleteMany();
        await Route.deleteMany();

        console.log('Data Destroyed...');

        // Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'sujith07cs@gmail.com',
            password: '123456',
            role: 'admin',
            department: 'MCA',
            registerNumber: 'ADMIN001',
            mobile: '9999999999',
            city: 'Coimbatore'
        });

        console.log(`Admin User Created: ${adminUser.email} / 123456`);

        // Create Routes
        const routes = await Route.insertMany([
            {
                routeName: 'Gandhipuram Route',
                routeNumber: '101',
                startingPoint: 'Gandhipuram',
                endingPoint: 'KASC Campus',
                startTime: '08:00 AM',
                endTime: '09:00 AM',
                stops: [
                    { stopName: 'Gandhipuram', arrivalTime: '08:00 AM' },
                    { stopName: 'Sivananda Colony', arrivalTime: '08:15 AM' },
                    { stopName: 'Saibaba Colony', arrivalTime: '08:30 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '09:00 AM' }
                ],
                distance: 10,
                estimatedDuration: '1 hour',
                fare: 500
            },
            {
                routeName: 'Singanallur Route',
                routeNumber: '102',
                startingPoint: 'Singanallur',
                endingPoint: 'KASC Campus',
                startTime: '07:45 AM',
                endTime: '09:00 AM',
                stops: [
                    { stopName: 'Singanallur', arrivalTime: '07:45 AM' },
                    { stopName: 'Ramanathapuram', arrivalTime: '08:00 AM' },
                    { stopName: 'Railway Station', arrivalTime: '08:30 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '09:00 AM' }
                ],
                distance: 15,
                estimatedDuration: '1 hour 15 min',
                fare: 600
            },
            {
                routeName: 'Ukkadam Route',
                routeNumber: '103',
                startingPoint: 'Ukkadam',
                endingPoint: 'KASC Campus',
                startTime: '08:15 AM',
                endTime: '09:00 AM',
                stops: [
                    { stopName: 'Ukkadam', arrivalTime: '08:15 AM' },
                    { stopName: 'Town Hall', arrivalTime: '08:25 AM' },
                    { stopName: 'RS Puram', arrivalTime: '08:40 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '09:00 AM' }
                ],
                distance: 8,
                estimatedDuration: '45 mins',
                fare: 450
            }
        ]);

        console.log('Routes Created...');

        // Create Drivers
        const drivers = await Driver.insertMany([
            {
                name: 'John Doe',
                licenseNumber: 'TN3820101234567',
                phone: '9876543210',
                address: '123 Gandhipuram, Coimbatore',
                experience: 5
            },
            {
                name: 'Jane Smith',
                licenseNumber: 'TN3820111234567',
                phone: '9876543211',
                address: '456 Singanallur, Coimbatore',
                experience: 3
            },
            {
                name: 'Bob Wilson',
                licenseNumber: 'TN3820121234567',
                phone: '9876543212',
                address: '789 Ukkadam, Coimbatore',
                experience: 7
            }
        ]);

        console.log('Drivers Created...');

        // Create Buses and link them
        const buses = await Bus.insertMany([
            {
                busNumber: 'Bus 101',
                capacity: 50,
                registrationNumber: 'TN 38 AB 1234',
                type: 'Non-AC',
                insuranceExpiry: new Date('2025-12-31'),
                fitnessExpiry: new Date('2025-12-31'),
                route: routes[0]._id, // 101 Gandhipuram
                driver: drivers[0]._id  // John Doe
            },
            {
                busNumber: 'Bus 102',
                capacity: 50,
                registrationNumber: 'TN 38 CD 5678',
                type: 'Non-AC',
                insuranceExpiry: new Date('2025-12-31'),
                fitnessExpiry: new Date('2025-12-31'),
                route: routes[1]._id, // 102 Singanallur
                driver: drivers[1]._id  // Jane Smith
            },
            {
                busNumber: 'Bus 103',
                capacity: 40,
                registrationNumber: 'TN 38 EF 9012',
                type: 'AC',
                insuranceExpiry: new Date('2025-12-31'),
                fitnessExpiry: new Date('2025-12-31'),
                route: routes[2]._id, // 103 Ukkadam
                driver: drivers[2]._id  // Bob Wilson
            }
        ]);

        // Update drivers with assigned bus
        await Driver.findByIdAndUpdate(drivers[0]._id, { assignedBus: buses[0]._id });
        await Driver.findByIdAndUpdate(drivers[1]._id, { assignedBus: buses[1]._id });
        await Driver.findByIdAndUpdate(drivers[2]._id, { assignedBus: buses[2]._id });

        console.log('Buses Created...');
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};
