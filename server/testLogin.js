const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected');

    try {
        // Find admin user
        const admin = await User.findOne({ email: 'admin@kasc.ac.in' }).select('+password');

        if (!admin) {
            console.log('Admin user not found!');
            process.exit(1);
        }

        console.log('Admin user found:');
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);
        console.log('Name:', admin.name);

        // Test password
        const testPassword = 'Admin@123';
        const isMatch = await admin.matchPassword(testPassword);

        console.log('\nPassword test with "Admin@123":', isMatch ? 'SUCCESS' : 'FAILED');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}).catch(err => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});
