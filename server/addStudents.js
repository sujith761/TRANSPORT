const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        addStudents();
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    });

const addStudents = async () => {
    try {
        const students = await User.insertMany([
            {
                name: 'Sujith Kumar',
                email: 'sujith@example.com',
                password: 'password123',
                role: 'student',
                registerNumber: '21MCA001',
                department: 'MCA',
                mobile: '9876543210',
                city: 'Coimbatore'
            },
            {
                name: 'Rahul R',
                email: 'rahul@example.com',
                password: 'password123',
                role: 'student',
                registerNumber: '21MCA002',
                department: 'MCA',
                mobile: '9876543211',
                city: 'Salem'
            },
            {
                name: 'Priya K',
                email: 'priya@example.com',
                password: 'password123',
                role: 'student',
                registerNumber: '21BCA045',
                department: 'BCA',
                mobile: '9876543212',
                city: 'Erode'
            },
            {
                name: 'Anitha S',
                email: 'anitha@example.com',
                password: 'password123',
                role: 'student',
                registerNumber: '21BCO067',
                department: 'B.Com',
                mobile: '9876543213',
                city: 'Tirupur'
            },
            {
                name: 'Ganesh M',
                email: 'ganesh@example.com',
                password: 'password123',
                role: 'student',
                registerNumber: '21BIT012',
                department: 'B.Sc IT',
                mobile: '9876543214',
                city: 'Pollachi'
            }
        ]);

        console.log(`✅ ${students.length} mock students added successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('Error adding students:', err.message);
        process.exit(1);
    }
};
