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

const sendEmail = (email, name, role) => {
    const mailOptions = {
        from: emailAddress,
        to: email,
        subject: 'Reminder: Check your account',
        text: `Hello ${name},\n\nIt has been 28 days since your last interaction. This is a reminder to check with each other.`
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log(`${role} email sent: ${info.response}`);
        }
    });
};

const sendMeetingReminder = (email, name, role) => {
    const mailOptions = {
        from: emailAddress,
        to: email,
        subject: 'Meeting Reminder: Schedule or Check your meetings',
        text: `Hello ${name},\n\nIt has been 28 days since your last meeting or there is no meeting scheduled. Please schedule a meeting or check the existing ones.`
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
            sendEmail(student.email, student.name, 'Student');

            const allocation = await Allocation.findOne({ student: student._id });
            if (allocation) {
                const tutor = await Tutor.findById(allocation.tutor);
                if (tutor) {
                    sendEmail(tutor.email, tutor.name, 'Tutor');
                }

                const meeting = await Meeting.findOne({ allocationId: allocation._id });
                if (meeting) {
                    const meetingDate = new Date(meeting.dateTime);
                    if (meetingDate <= date28DaysAgo) {
                        sendMeetingReminder(student.email, student.name, 'Student');
                        if (tutor) sendMeetingReminder(tutor.email, tutor.name, 'Tutor');
                    }
                } else {
                    sendMeetingReminder(student.email, student.name, 'Student');
                    if (tutor) sendMeetingReminder(tutor.email, tutor.name, 'Tutor');
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
    parentPort.postMessage({ status: 'done' });
};

startWorker().catch((err) => {
    console.error('Worker encountered an error:', err);
    parentPort.postMessage({ status: 'error', message: 'Worker encountered an error' });
    process.exit(1);
});