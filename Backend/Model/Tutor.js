import mongoose from "mongoose";
import Meeting from './Meeting.js';
import Student from "./Student.js";
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { tutorAssignmentEmail, tutorRemovalEmail, tutorNotificationEmail } from "../Service/emailTemplates.js";

const TutorSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        require: false
    }],

    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        require: false
    }],
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        require: false
    }],
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        require: false
    }]
}, { timestamps: true });

// Middleware to enforce max 10 students rule before saving
TutorSchema.pre('save', async function (next) {

    try {
        const tutor = this;
        if (tutor.students.length > 10) {
            return next(new Error('A tutor cannot have more than 10 students.'));
        }



        for (const studentId of tutor.students) {

            const existingTutor = await mongoose.model('Tutor').findOne({
                students: studentId, 
                _id: { $ne: tutor._id } 
            });

            // If the student is found in another tutor's list, throw an error
            if (existingTutor) {
                return next(new Error(`Student with ID ${studentId} is already allocated to another tutor.`));
            }
        }

        next();
    } catch (error) {
        next(error);
    }

});




TutorSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();

        if (!update.students) return next();

        // Find the tutor before updating
        const tutor = await mongoose.model("Tutor").findById(this.getQuery());
        if (!tutor) return next();

        const originalStudents = tutor.students.map(student => student.toString());
        const updatedStudents = update.students.map(student => student.toString());

        // ❌ Reject if more than 10 students
        if (updatedStudents.length > 10) {
            return next(new Error("A tutor cannot have more than 10 students."));
        }

        // ❌ Reject if student is already assigned to another tutor

        for (const studentId of update.students) {

            const existingTutor = await mongoose.model('Tutor').findOne({
                students: studentId,
                _id: { $ne: tutor._id }
            });

            // If the student is found in another tutor's list, throw an error
            if (existingTutor) {
                return next(new Error(`Student with ID ${studentId} is already allocated to another tutor.`));
            }
        }


        const addedStudents = updatedStudents.filter(id => !originalStudents.includes(id));
        const removedStudents = originalStudents.filter(id => !updatedStudents.includes(id));

        // Notify added students
        if (addedStudents.length > 0) {
            const students = await Student.find({ _id: { $in: addedStudents } });
            const studentEmails = students.map(student => student.email);

            console.log("📧 Sending tutor assignment emails to:", studentEmails);
            const emailContent = tutorAssignmentEmail(tutor);

            const mailOptions = {
                from: emailAddress,
                to: studentEmails.join(","),
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            };

            await emailTransporter.sendMail(mailOptions);
            console.log("✅ Tutor assignment emails sent successfully.");
        }

        // Notify removed students
        if (removedStudents.length > 0) {
            const students = await Student.find({ _id: { $in: removedStudents } });
            const studentEmails = students.map(student => student.email);

            console.log("📧 Sending tutor removal emails to:", studentEmails);
            const emailContent = tutorRemovalEmail(tutor);

            const mailOptions = {
                from: emailAddress,
                to: studentEmails.join(","),
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            };

            await emailTransporter.sendMail(mailOptions);
            console.log("✅ Tutor removal emails sent successfully.");
        }


        // 🔹 Send Email to Tutor (Only if changes were made)
        if (addedStudents.length > 0 || removedStudents.length > 0) {
            console.log(`📧 Sending student allocation change email to Tutor: ${tutor.email}`);

            const emailContent = tutorNotificationEmail(tutor, addedStudents, removedStudents);

            await emailTransporter.sendMail({
                from: emailAddress,
                to: tutor.email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            });

            console.log("✅ Tutor notified about student allocation changes.");
        }
        next();
    } catch (error) {
        next(error);
    }
});


TutorSchema.pre('findOneAndDelete', async function (next) {
    try {
        //Deleting meeting when tutor deleted
        const tutorId = this.getQuery()._id; // Get the tutor ID being deleted
        await Meeting.deleteMany({ tutor: tutorId }); // Remove related meetings


        const tutor = await mongoose.model("Tutor").findById(tutorId);
        if (!tutor) return next();

        //Sending Email when tutor is deleted
        const students = await Student.find({ _id: { $in: tutor.students } });
        if (students.length > 0) {
            const studentEmails = students.map(student => student.email);
            console.log("📧 Notifying students about tutor removal:", studentEmails);

       
            const emailContent = tutorRemovalEmail(tutor);

            const mailOptions = {
                from: emailAddress,
                to: studentEmails.join(","),
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            };

            // Send emails
            await emailTransporter.sendMail(mailOptions);
            console.log("✅ Tutor removal emails sent successfully.");
        }
        next();
    } catch (error) {
        next(error);
    }
});

/** 🔹 Post-Save Hook: Send Email to Students When Tutor is Assigned */
TutorSchema.post("save", async function (doc) {
    try {
        console.log("✅ Post-save hook triggered for tutor:", doc.name);

        // Fetch the students' emails
        const students = await Student.find({ _id: { $in: doc.students } });
        console.log("📧 Number of students assigned:", students.length);

        if (students.length > 0) {
            const studentEmails = students.map(student => student.email);
            console.log("📧 Sending email to students:", studentEmails);

            // Use the imported email template
            const emailContent = tutorAssignmentEmail(doc);

            const mailOptions = {
                from: emailAddress,
                to: studentEmails.join(","),
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            };

            // Send emails
            await emailTransporter.sendMail(mailOptions);
            console.log("✅ Tutor assignment emails sent successfully.");
        }
    } catch (error) {
        console.error("❌ Error in post-save hook while sending emails:", error);
    }
});

const Tutor = mongoose.model('Tutor', TutorSchema);

export default Tutor;