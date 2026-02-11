const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Driver = require('./models/Driver');
const Route = require('./models/Route');
const Maintenance = require('./models/Maintenance');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        addData();
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    });

const addData = async () => {
    try {
        // Get existing data
        const existingRoutes = await Route.find();
        const existingDrivers = await Driver.find();
        const existingBuses = await Bus.find();

        console.log(`Existing: ${existingRoutes.length} routes, ${existingDrivers.length} drivers, ${existingBuses.length} buses`);

        // ==================== ADD 4 NEW ROUTES ====================
        const newRoutes = await Route.insertMany([
            {
                routeName: 'Peelamedu Route',
                routeNumber: '104',
                startingPoint: 'Peelamedu',
                endingPoint: 'KASC Campus',
                startTime: '07:30 AM',
                endTime: '08:45 AM',
                stops: [
                    { stopName: 'Peelamedu', arrivalTime: '07:30 AM' },
                    { stopName: 'Fun Republic', arrivalTime: '07:45 AM' },
                    { stopName: 'Hopes College', arrivalTime: '08:00 AM' },
                    { stopName: 'Nehru Nagar', arrivalTime: '08:20 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '08:45 AM' }
                ],
                distance: 12,
                estimatedDuration: '1 hour 15 min',
                fare: 550
            },
            {
                routeName: 'Saravanampatti Route',
                routeNumber: '105',
                startingPoint: 'Saravanampatti',
                endingPoint: 'KASC Campus',
                startTime: '07:15 AM',
                endTime: '08:30 AM',
                stops: [
                    { stopName: 'Saravanampatti', arrivalTime: '07:15 AM' },
                    { stopName: 'Vilankurichi', arrivalTime: '07:30 AM' },
                    { stopName: 'Thudiyalur', arrivalTime: '07:50 AM' },
                    { stopName: 'GN Mills', arrivalTime: '08:10 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '08:30 AM' }
                ],
                distance: 18,
                estimatedDuration: '1 hour 15 min',
                fare: 650
            },
            {
                routeName: 'Pollachi Route',
                routeNumber: '106',
                startingPoint: 'Pollachi',
                endingPoint: 'KASC Campus',
                startTime: '06:45 AM',
                endTime: '08:45 AM',
                stops: [
                    { stopName: 'Pollachi Bus Stand', arrivalTime: '06:45 AM' },
                    { stopName: 'Kinathukadavu', arrivalTime: '07:15 AM' },
                    { stopName: 'Madukkarai', arrivalTime: '07:45 AM' },
                    { stopName: 'Podanur', arrivalTime: '08:15 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '08:45 AM' }
                ],
                distance: 40,
                estimatedDuration: '2 hours',
                fare: 900
            },
            {
                routeName: 'Tirupur Route',
                routeNumber: '107',
                startingPoint: 'Tirupur',
                endingPoint: 'KASC Campus',
                startTime: '06:30 AM',
                endTime: '08:30 AM',
                stops: [
                    { stopName: 'Tirupur Bus Stand', arrivalTime: '06:30 AM' },
                    { stopName: 'Avinashi', arrivalTime: '07:00 AM' },
                    { stopName: 'Annur', arrivalTime: '07:30 AM' },
                    { stopName: 'Karamadai', arrivalTime: '08:00 AM' },
                    { stopName: 'KASC Campus', arrivalTime: '08:30 AM' }
                ],
                distance: 50,
                estimatedDuration: '2 hours',
                fare: 1000
            }
        ]);
        console.log('✅ 4 New Routes Created');

        // ==================== ADD 4 NEW DRIVERS ====================
        const newDrivers = await Driver.insertMany([
            {
                name: 'Rajesh Kumar',
                licenseNumber: 'TN3820131234567',
                phone: '9876543213',
                address: '101 Peelamedu, Coimbatore',
                experience: 8
            },
            {
                name: 'Suresh Babu',
                licenseNumber: 'TN3820141234567',
                phone: '9876543214',
                address: '202 Saravanampatti, Coimbatore',
                experience: 6
            },
            {
                name: 'Murugan K',
                licenseNumber: 'TN3820151234567',
                phone: '9876543215',
                address: '303 Pollachi Main Road, Pollachi',
                experience: 10
            },
            {
                name: 'Senthil Nathan',
                licenseNumber: 'TN3820161234567',
                phone: '9876543216',
                address: '404 Tirupur Road, Tirupur',
                experience: 4
            }
        ]);
        console.log('✅ 4 New Drivers Created');

        // ==================== ADD 4 NEW BUSES ====================
        const newBuses = await Bus.insertMany([
            {
                busNumber: 'Bus 104',
                capacity: 45,
                registrationNumber: 'TN 38 GH 3456',
                type: 'AC',
                insuranceExpiry: new Date('2026-12-31'),
                fitnessExpiry: new Date('2026-12-31'),
                route: newRoutes[0]._id,
                driver: newDrivers[0]._id
            },
            {
                busNumber: 'Bus 105',
                capacity: 55,
                registrationNumber: 'TN 38 IJ 7890',
                type: 'Non-AC',
                insuranceExpiry: new Date('2026-06-30'),
                fitnessExpiry: new Date('2026-06-30'),
                route: newRoutes[1]._id,
                driver: newDrivers[1]._id
            },
            {
                busNumber: 'Bus 106',
                capacity: 50,
                registrationNumber: 'TN 38 KL 2345',
                type: 'Non-AC',
                insuranceExpiry: new Date('2026-09-30'),
                fitnessExpiry: new Date('2026-09-30'),
                route: newRoutes[2]._id,
                driver: newDrivers[2]._id
            },
            {
                busNumber: 'Bus 107',
                capacity: 60,
                registrationNumber: 'TN 38 MN 6789',
                type: 'AC',
                insuranceExpiry: new Date('2027-03-31'),
                fitnessExpiry: new Date('2027-03-31'),
                route: newRoutes[3]._id,
                driver: newDrivers[3]._id
            }
        ]);
        console.log('✅ 4 New Buses Created');

        // Update new drivers with assigned buses
        await Driver.findByIdAndUpdate(newDrivers[0]._id, { assignedBus: newBuses[0]._id });
        await Driver.findByIdAndUpdate(newDrivers[1]._id, { assignedBus: newBuses[1]._id });
        await Driver.findByIdAndUpdate(newDrivers[2]._id, { assignedBus: newBuses[2]._id });
        await Driver.findByIdAndUpdate(newDrivers[3]._id, { assignedBus: newBuses[3]._id });
        console.log('✅ Drivers linked to Buses');

        // ==================== ADD 4 MAINTENANCE RECORDS ====================
        // Use both old and new buses for maintenance
        const allBuses = [...existingBuses, ...newBuses];

        await Maintenance.insertMany([
            {
                bus: allBuses[0]._id,
                maintenanceType: 'Service',
                description: 'Regular engine oil change and filter replacement',
                cost: 5500,
                serviceDate: new Date('2026-01-15'),
                nextServiceDate: new Date('2026-04-15'),
                servicedBy: 'Lakshmi Motors Pvt Ltd',
                status: 'Completed',
                notes: 'All fluids topped up, brake pads checked'
            },
            {
                bus: allBuses[2]._id,
                maintenanceType: 'Repair',
                description: 'AC compressor replacement and gas refill',
                cost: 18000,
                serviceDate: new Date('2026-02-01'),
                nextServiceDate: null,
                servicedBy: 'Coimbatore Auto AC Works',
                status: 'Completed',
                notes: 'AC compressor was faulty, replaced with new unit. Cooling tested OK.'
            },
            {
                bus: allBuses[4]._id,
                maintenanceType: 'Insurance Renewal',
                description: 'Annual comprehensive insurance renewal for Bus 105',
                cost: 25000,
                serviceDate: new Date('2026-02-10'),
                nextServiceDate: new Date('2027-02-10'),
                servicedBy: 'New India Assurance',
                status: 'Completed',
                notes: 'Policy renewed for 1 year. Covers third party and own damage.'
            },
            {
                bus: allBuses[5]._id,
                maintenanceType: 'Fitness Check',
                description: 'Annual fitness certificate renewal at RTO',
                cost: 3500,
                serviceDate: new Date('2026-02-15'),
                nextServiceDate: new Date('2027-02-15'),
                servicedBy: 'RTO Coimbatore',
                status: 'Scheduled',
                notes: 'Scheduled for fitness inspection. All documents ready.'
            }
        ]);
        console.log('✅ 4 Maintenance Records Created');

        // Final counts
        const finalRoutes = await Route.countDocuments();
        const finalDrivers = await Driver.countDocuments();
        const finalBuses = await Bus.countDocuments();
        const finalMaintenance = await Maintenance.countDocuments();

        console.log('\n📊 Final Data Summary:');
        console.log(`   Routes:      ${finalRoutes}`);
        console.log(`   Drivers:     ${finalDrivers}`);
        console.log(`   Buses:       ${finalBuses}`);
        console.log(`   Maintenance: ${finalMaintenance}`);
        console.log('\n✅ All data added successfully!');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};
