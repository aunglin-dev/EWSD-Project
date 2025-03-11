import mongoose from 'mongoose';
import { seedStaff } from './staffSeeder.js';
import { seedTutors } from './tutorSeeder.js';
import { seedStudents } from './studentSeeder.js';

const seeder = async () => {
    try {
        // Start seeding process
        await seedStaff();    // Seed Staff first
        await seedTutors();   // Then seed Tutors
        await seedStudents(); // Finally seed Students

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error during seeding process:", error);
        mongoose.disconnect();
    }
};

export default seeder;