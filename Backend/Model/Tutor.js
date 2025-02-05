import mongoose from "mongoose";
import Meeting from './Meeting.js';
import Student from "./Student.js";
import { emailTransporter, emailAddress } from "../Service/emailService.js";
import { tutorRemovalEmail } from "../Service/emailTemplates.js";

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




TutorSchema.pre('findOneAndDelete', async function (next) {
    try {
        //Deleting meeting when tutor deleted
        const tutorId = this.getQuery()._id; // Get the tutor ID being deleted
        await Meeting.deleteMany({ tutor: tutorId }); // Remove related meetings


        const tutor = await mongoose.model("Tutor").findById(tutorId);
        if (!tutor) return next();

        // Fetch all allocations associated with this tutor
        const allocations = await mongoose.model("Allocation").find({ tutor: tutorId });

        // If there are no allocations, proceed to delete without notifying students
        if (allocations.length > 0) {
            // Extract student IDs from the allocations
            const studentIds = allocations.map(allocation => allocation.student);

            // Fetch student details based on the student IDs
            const students = await Student.find({ _id: { $in: studentIds } });
            if (students.length > 0) {
                const studentEmails = students.map(student => student.email);
                console.log("📧 Notifying students about tutor removal:", studentEmails);

                // Send email notification to students
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
        }

        next();
    } catch (error) {
        next(error);
    }
});

///** 🔹 Post-Save Hook: Send Email to Students When Tutor is Assigned */
//TutorSchema.post("save", async function (doc) {
//    try {
//        console.log("✅ Post-save hook triggered for tutor:", doc.name);

//        // Fetch the students' emails
//        const students = await Student.find({ _id: { $in: doc.students } });
//        console.log("📧 Number of students assigned:", students.length);

//        if (students.length > 0) {
//            const studentEmails = students.map(student => student.email);
//            console.log("📧 Sending email to students:", studentEmails);

//            // Use the imported email template
//            const emailContent = tutorAssignmentEmail(doc);

//            const mailOptions = {
//                from: emailAddress,
//                to: studentEmails.join(","),
//                subject: emailContent.subject,
//                text: emailContent.text,
//                html: emailContent.html
//            };

//            // Send emails
//            await emailTransporter.sendMail(mailOptions);
//            console.log("✅ Tutor assignment emails sent successfully.");
//        }
//    } catch (error) {
//        console.error("❌ Error in post-save hook while sending emails:", error);
//    }
//});

const Tutor = mongoose.model('Tutor', TutorSchema);

export default Tutor;