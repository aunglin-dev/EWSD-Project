import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import { parentPort } from 'worker_threads';

import Student from '../Model/Student.js';
import Allocation from '../Model/Allocation.js';
import Tutor from '../Model/Tutor.js';
import Meeting from '../Model/Meeting.js';

export const emailAddress = "zakiayayacoob@gmail.com"
export const emailTransporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailAddress,
        pass: "qdmj hvyc okrn bphv",
    }
});



const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Worker connected to MongoDB');
    } catch (err) {
        console.error('Worker connection error:', err.message);
        parentPort.postMessage({ status: 'error', message: 'MongoDB connection failed' });
        process.exit(1);
    }
};

const sendEmail = async (email, name, role) => {
    let subject, text;

    // Define role-specific subject and body content
    if (role === 'Tutor') {
        subject = 'Reminder: Time to Check In with Your Student';
        text = `Hello ${name},\n\nIt has been 28 days since your last interaction with your student. This is a reminder to check in and offer any additional support or resources. Keeping your student engaged is key to their success.\n\nBest regards,\nYour Teaching Platform`;
    } else if (role === 'Student') {
        subject = 'Reminder: Time to Connect with Your Tutor';
        text = `Hello ${name},\n\nIt has been 28 days since your last session with your tutor. This is a reminder to schedule your next tutoring session and keep progressing towards your learning goals.\n\nBest regards,\nYour Learning Platform`;
    }

    const mailOptions = {
        from: emailAddress,
        to: email,
        subject: subject,
        text: text
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log(`${role} email sent: ${info.response}`);
        }
    });
};

const sendMeetingReminder = async (email, name, role) => {

    let subject, text;

    // Define role-specific subject and body content for the meeting reminder
    if (role === 'Tutor') {
        subject = 'Meeting Reminder: Schedule a Check-In with Your Student';
        text = `Hello ${name},\n\nIt has been 28 days since your last meeting with your student. Please make sure to schedule a meeting to discuss their progress and provide any additional guidance.\n\nBest regards,\nYour Teaching Platform`;
    } else if (role === 'Student') {
        subject = 'Meeting Reminder: Schedule a Session with Your Tutor';
        text = `Hello ${name},\n\nIt has been 28 days since your last session with your tutor. Please ensure that you schedule your next session to keep up with your learning and development.\n\nBest regards,\nYour Learning Platform`;
    }

    const mailOptions = {
        from: emailAddress,
        to: email,
        subject: subject,
        text: text
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending meeting reminder:', error);
        } else {
            console.log(`${role} meeting reminder sent: ${info.response}`);
        }
    });
};

const checkStudents = async () => {
    try {
        const date28DaysAgo = new Date();
        date28DaysAgo.setDate(date28DaysAgo.getDate() - 28);

        const students = await Student.find({
            lastInteractionDate: { $lte: date28DaysAgo },
        });

        // Changed forEach to for...of to handle async/await properly
        for (const student of students) {
            await sendEmail(student.email, student.name, 'Student');

            const allocation = await Allocation.findOne({ student: student._id });
            if (allocation) {
                const tutor = await Tutor.findById(allocation.tutor);
                if (tutor) {
                    await sendEmail(tutor.email, tutor.name, 'Tutor');
                }

                const meeting = await Meeting.findOne({ allocationId: allocation._id });
                if (meeting) {
                    const meetingDate = new Date(meeting.dateTime);
                    if (meetingDate <= date28DaysAgo) {
                        await sendMeetingReminder(student.email, student.name, 'Student');
                        if (tutor) await sendMeetingReminder(tutor.email, tutor.name, 'Tutor');
                    }
                } else {
                    await sendMeetingReminder(student.email, student.name, 'Student');
                    if (tutor) await sendMeetingReminder(tutor.email, tutor.name, 'Tutor');
                }
            }
        }

    } catch (err) {
        console.error('Error fetching students:', err);
        parentPort.postMessage({ status: 'error', message: 'Error fetching students' });
        process.exit(1);
    }
};

const startWorker = async () => {
    await connectToMongoDB();
    await checkStudents();
    parentPort.postMessage({ status: 'Email Sent!' });
};

startWorker().catch((err) => {
    console.error('Worker encountered an error:', err);
    parentPort.postMessage({ status: 'error', message: 'Worker encountered an error' });
    process.exit(1);
});