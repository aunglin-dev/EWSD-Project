import mongoose from "mongoose";
import Meeting from './Meeting.js';

import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { allocationRemovalEmail, allocationAssignmentEmail, tutorNotificationEmail, tutorAssignmentNotificationEmail } from "../Service/emailTemplates.js";


const allocationSchema = new mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tutor",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            unique: true,
        },

        createdStaffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },

        schedule: {
            type: [String], 
            enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        note: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);


// Middleware to enforce allocation rules before saving
allocationSchema.pre("save", async function (next) {
    try {
        const allocation = this;

        // Check if the tutor already has 10 students allocated
        const tutorAllocations = await mongoose.model("Allocation").countDocuments({
            tutor: allocation.tutor,
        });

        if (tutorAllocations >= 10) {
            return next(new Error("A tutor cannot have more than 10 students."));
        }

        // Check if the student is already allocated to another tutor
        const existingAllocation = await mongoose.model("Allocation").findOne({
            student: allocation.student,
            _id: { $ne: allocation._id },
        });

        if (existingAllocation) {
            return next(new Error(`Student with ID ${allocation.student} is already allocated to another tutor.`));
        }

        next();
    } catch (error) {
        next(error);
    }
});


// Post-save hook to send email notifications
allocationSchema.post("save", async function (doc) {
    try {
        console.log("✅ Post-save hook triggered for allocation");

        // Fetch student and tutor details
        const student = await mongoose.model("Student").findById(doc.student);
        const tutor = await mongoose.model("Tutor").findById(doc.tutor);

        if (!student || !tutor) {
            console.log("⚠️ Student or tutor not found. Skipping email.");
            return;
        }

        // Email to student
        console.log(`📧 Sending email to student: ${student.email}`);

        // Use the imported email template for the student
        const studentEmailContent = allocationAssignmentEmail(student, tutor);

        const studentMailOptions = {
            from: emailAddress,
            to: student.email,
            subject: studentEmailContent.subject,
            text: studentEmailContent.text,
            html: studentEmailContent.html,
        };

        // Send email to student
        await emailTransporter.sendMail(studentMailOptions);
        console.log("✅ Allocation assignment email sent to student successfully.");

        // Email to tutor
        console.log(`📧 Sending email to tutor: ${tutor.email}`);

        // Use the imported email template for the tutor
        const tutorEmailContent = tutorAssignmentNotificationEmail(student, tutor);

        const tutorMailOptions = {
            from: emailAddress,
            to: tutor.email,
            subject: tutorEmailContent.subject,
            text: tutorEmailContent.text,
            html: tutorEmailContent.html,
        };

        // Send email to tutor
        await emailTransporter.sendMail(tutorMailOptions);
        console.log("✅ Allocation assignment email sent to tutor successfully.");
    } catch (error) {
        console.error("❌ Error in post-save hook while sending email:", error);
    }
});


allocationSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();

        if (!update.student || !update.tutor) return next();

        // Fetch the allocation before updating
        const allocation = await mongoose.model("Allocation").findById(this.getQuery());
        if (!allocation) return next();

        const originalTutor = allocation.tutor.toString();
        const updatedTutor = update.tutor.toString();

        const originalStudent = allocation.student.toString();
        const updatedStudent = update.student.toString();

        const studentId = update.student.toString();

        // ❌ Reject if student is already assigned to another tutor
        const existingAllocation = await mongoose.model("Allocation").findOne({
            student: studentId,
            _id: { $ne: allocation._id }
        });

        if (existingAllocation) {
            return next(new Error(`Student with ID ${studentId} is already allocated to another tutor.`));
        }

        // Check the tutor's student count
        const tutorAllocations = await mongoose.model("Allocation").find({ tutor: updatedTutor });
        if (tutorAllocations.length >= 10) {
            return next(new Error("A tutor cannot have more than 10 students."));
        }

        // **Handle Email Notifications**
        const student = await mongoose.model("Student").findById(studentId);
        const tutor = await mongoose.model("Tutor").findById(updatedTutor);

        if (!student || !tutor) {
            console.log("⚠️ Student or tutor not found. Skipping email.");
            return next();
        }

        if (originalTutor !== updatedTutor) {
            // Notify the student about the new tutor assignment
            console.log(`📧 Sending tutor assignment email to student: ${student.email}`);
            const emailContent = allocationAssignmentEmail(student, tutor);

            await emailTransporter.sendMail({
                from: emailAddress,
                to: student.email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            });

            console.log("✅ Student notified about new tutor assignment.");

            // Notify the previous tutor (if changed)
            const previousTutor = await mongoose.model("Tutor").findById(originalTutor);
            if (previousTutor) {
                console.log(`📧 Sending student removal email to previous tutor: ${previousTutor.email}`);
                const removalEmailContent = allocationRemovalEmail(student, previousTutor);

                await emailTransporter.sendMail({
                    from: emailAddress,
                    to: previousTutor.email,
                    subject: removalEmailContent.subject,
                    text: removalEmailContent.text,
                    html: removalEmailContent.html
                });

                console.log("✅ Previous tutor notified about student removal.");
            }

            // Notify the new tutor
            console.log(`📧 Sending student allocation update email to tutor: ${tutor.email}`);
            const tutorNotification = tutorNotificationEmail(tutor, student);

            await emailTransporter.sendMail({
                from: emailAddress,
                to: tutor.email,
                subject: tutorNotification.subject,
                text: tutorNotification.text,
                html: tutorNotification.html
            });

            console.log("✅ Tutor notified about student allocation change.");
        }

        if (originalStudent !== updatedStudent) {
            console.log("📧 Sending tutor assignment emails to new student:", student.email);

            const tutorAssignmentEmailContent = allocationAssignmentEmail(student, tutor);  

            const tutorAssignmentMailOptions = {
                from: emailAddress,
                to: student.email,
                subject: tutorAssignmentEmailContent.subject, 
                text: tutorAssignmentEmailContent.text,
                html: tutorAssignmentEmailContent.html
            };

            await emailTransporter.sendMail(tutorAssignmentMailOptions);
            console.log("✅ Tutor assignment emails sent successfully.");

            // Fetch original student email from the database
            const originalStudentData = await mongoose.model("Student").findById(originalStudent);
            const originalStudentEmail = originalStudentData ? originalStudentData.email : null;

            if (originalStudentEmail) {
                console.log("📧 Sending tutor removal emails to:", originalStudentEmail);

                const tutorRemovalEmailContent = allocationRemovalEmail(student, tutor);  

                const tutorRemovalMailOptions = {
                    from: emailAddress,
                    to: originalStudentEmail,
                    subject: tutorRemovalEmailContent.subject,
                    text: tutorRemovalEmailContent.text,
                    html: tutorRemovalEmailContent.html
                };

                await emailTransporter.sendMail(tutorRemovalMailOptions);
                console.log("✅ Tutor removal emails sent successfully.");
            } else {
                console.log("❌ Failed to retrieve the original student's email.");
            }
        }


        next();
    } catch (error) {
        next(error);
    }
});


allocationSchema.pre("findOneAndDelete", async function (next) {
    try {
        const allocationId = this.getQuery()._id; // Get the allocation ID being deleted
        const allocation = await mongoose.model("Allocation").findById(allocationId);

        if (!allocation) return next();

        const { student, tutor } = allocation;

        // ❌ Delete all meetings related to this allocation
        await Meeting.deleteMany({ student, tutor });
        console.log(`🗑️ Deleted meetings for student ${student} and tutor ${tutor}`);

        // Fetch student and tutor details
        const studentData = await mongoose.model("Student").findById(student);
        const tutorData = await mongoose.model("Tutor").findById(tutor);

        if (studentData && tutorData) {
            const studentEmail = studentData.email;
            const tutorEmail = tutorData.email;

            console.log(`📧 Notifying student (${studentEmail}) about allocation removal`);
            const studentEmailContent = allocationRemovalEmail(studentData, tutorData);

            await emailTransporter.sendMail({
                from: emailAddress,
                to: studentEmail,
                subject: studentEmailContent.subject,
                text: studentEmailContent.text,
                html: studentEmailContent.html
            });
            console.log("✅ Student notified about allocation removal.");

            console.log(`📧 Notifying tutor (${tutorEmail}) about student removal`);
            const tutorEmailContent = tutorNotificationEmail(tutorData, [student]);


            await emailTransporter.sendMail({
                from: emailAddress,
                to: tutorEmail,
                subject: tutorEmailContent.subject,
                text: tutorEmailContent.text,
                html: tutorEmailContent.html
            });
            console.log("✅ Tutor notified about student unassignment.");
        } else {
            console.log("Failed to send email.");
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Allocation = mongoose.model("Allocation", allocationSchema);

export default Allocation;
