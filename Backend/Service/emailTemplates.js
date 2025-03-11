
export const tutorAssignmentEmail = (tutor) => {
    return {
        subject: "You Have Been Assigned a Personal Tutor",
        text: `Dear Student,

We are pleased to inform you that you have been assigned a personal tutor as part of our eTutoring system. 

Tutor Name: ${tutor.name}
Tutor Email: ${tutor.email}
Department: ${tutor.department}

Your tutor will be available to assist you with academic guidance and support. You can schedule meetings, share documents, and communicate through the eTutoring platform.

Please log in to your eTutoring account for further details and to connect with your tutor.

Best regards,  
University eTutoring Team`,
        html: `
            <p>Dear Student,</p>
            <p>We are pleased to inform you that you have been assigned a personal tutor as part of our eTutoring system.</p>
            <p><strong>Tutor Name:</strong> ${tutor.name} <br>
            <strong>Tutor Email:</strong> ${tutor.email} <br>
            <strong>Department:</strong> ${tutor.department}</p>
            <p>Your tutor will be available to assist you with academic guidance and support. You can schedule meetings, share documents, and communicate through the eTutoring platform.</p>
            <p>Please <a href="https://etutoring.university.com">log in to your eTutoring account</a> for further details and to connect with your tutor.</p>
            <p>Best regards,<br>
            <strong>University eTutoring Team</strong></p>
        `
    };
};


export const tutorRemovalEmail = (tutor) => {
    return {
        subject: "Your Assigned Tutor Has Been Removed",
        text: `Dear Student,

We would like to inform you that your assigned tutor, ${tutor.name}, has been removed from the eTutoring system.

If you have any concerns or need further guidance, please contact the university support team.

Best regards,  
University eTutoring Team`,
        html: `
            <p>Dear Student,</p>
            <p>We would like to inform you that your assigned tutor, <strong>${tutor.name}</strong>, has been removed from the eTutoring system.</p>
            <p>If you have any concerns or need further guidance, please contact the university support team.</p>
            <p>Best regards,<br>
            <strong>University eTutoring Team</strong></p>
        `
    };
};



export const meetingNotificationEmail = (action, tutor, student, meeting) => {
    let subjectStudent;
    let messageStudent;

    if (action === "created") {
        subjectStudent = "New Meeting Scheduled - eTutoring System";
        messageStudent = `
            <p>Dear ${student.name},</p>
            <p>A new meeting has been scheduled with your tutor.</p>
            <ul>
                <li><strong>Tutor:</strong> ${tutor.name}</li>
                <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                <li><strong>Meeting Type:</strong> ${meeting.type}</li>
            </ul>
            <p>Please be on time.</p>
            <p>Best regards,<br><strong>University eTutoring Team</strong></p>
        `;
    } else if (action === "updated") {
        subjectStudent = "Meeting Updated - eTutoring System";
        messageStudent = `
            <p>Dear ${student.name},</p>
            <p>Your meeting with your tutor has been updated.</p>
            <ul>
                <li><strong>Tutor:</strong> ${tutor.name}</li>
                <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                <li><strong>Meeting Type:</strong> ${meeting.type}</li>
            </ul>
            <p>Please check your schedule.</p>
            <p>Best regards,<br><strong>University eTutoring Team</strong></p>
        `;
    } else if (action === "deleted") {
        subjectStudent = "Meeting Cancelled - eTutoring System";
        messageStudent = `
            <p>Dear ${student.name},</p>
            <p>Your scheduled meeting with ${tutor.name} has been cancelled.</p>
            <p>If you need to reschedule, please contact your tutor.</p>
            <p>Best regards,<br><strong>University eTutoring Team</strong></p>
        `;
    }

    return { subjectStudent, messageStudent };
}





export const meetingNotificationEmailForTutor = (action, tutor, student, meeting) => {
    let subjectTutor;
    let messageTutor;

    switch (action) {
        case "added":
            subjectTutor = "New Meeting Scheduled with a Student";
            messageTutor = `
                <p>Dear ${tutor.name},</p>
                <p>A new student, <strong>${student.name}</strong>, has been assigned to you for a meeting.</p>
                <ul>
                    <li><strong>Student Name:</strong> ${student.name}</li>
                    <li><strong>Email:</strong> ${student.email}</li>
                    <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                    <li><strong>Meeting Type:</strong> ${meeting.type}</li>
                </ul>
                <p>Please make the necessary preparations.</p>
                <p>Best regards,<br><strong>University eTutoring Team</strong></p>
            `;
            break;

        case "created":
            subjectTutor = "New Meeting Scheduled with a Student";
            messageTutor = `
                <p>Dear ${tutor.name},</p>
                <p>A new student, <strong>${student.name}</strong>, has been assigned to you for a meeting.</p>
                <ul>
                    <li><strong>Student Name:</strong> ${student.name}</li>
                    <li><strong>Email:</strong> ${student.email}</li>
                    <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                    <li><strong>Meeting Type:</strong> ${meeting.type}</li>
                </ul>
                <p>Please make the necessary preparations.</p>
                <p>Best regards,<br><strong>University eTutoring Team</strong></p>
            `;
            break;

        case "updated":
            subjectTutor = "Meeting Details Updated";
            messageTutor = `
                <p>Dear ${tutor.name},</p>
                <p>The details for your scheduled meeting with <strong>${student.name}</strong> have been updated.</p>
                <ul>
                    <li><strong>Student Name:</strong> ${student.name}</li>
                    <li><strong>Email:</strong> ${student.email}</li>
                     <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                    <li><strong>Meeting Type:</strong> ${meeting.type}</li>
                </ul>
                <p>Please check the new meeting details.</p>
                <p>Best regards,<br><strong>University eTutoring Team</strong></p>
            `;
            break;

        case "deleted":
            subjectTutor = "Meeting Cancelled - Student Removed";
            messageTutor = `
                <p>Dear ${tutor.name},</p>
                <p>We regret to inform you that your scheduled meeting with <strong>${student.name}</strong> has been cancelled as the student has been removed from the system.</p>
                <ul>
                    <li><strong>Student Name:</strong> ${student.name}</li>
                    <li><strong>Email:</strong> ${student.email}</li>
                           <li><strong>Date & Time:</strong> ${meeting.dateTime}</li>
                    <li><strong>Meeting Type:</strong> ${meeting.type}</li>
                </ul>
                <p>If you have any concerns, please contact the administration.</p>
                <p>Best regards,<br><strong>University eTutoring Team</strong></p>
            `;
            break;

        default:
            throw new Error("Invalid action type provided for email notification.");
    }

    return { subjectTutor, messageTutor };
};

export const allocationRemovalEmail = (student, tutor) => {
    return {
        subject: "⚠️ Your Tutor Allocation Has Been Removed",
        text: `Dear ${student.name},

We wanted to inform you that your tutor, ${tutor.name}, is no longer assigned to you.

If you have any concerns or need further assistance, please contact support.

Best regards,  
The Admin Team`,
        html: `
            <p>Dear <strong>${student.name}</strong>,</p>
            <p>We wanted to inform you that your tutor, <strong>${tutor.name}</strong>, is no longer assigned to you.</p>
            <p>If you have any concerns or need further assistance, please contact support.</p>
            <p>Best regards,</p>
            <p><strong>The Admin Team</strong></p>
        `
    };
};


export const tutorNotificationEmail = (tutor, removedStudents) => {
    // Generate a list of student names
    const studentList = removedStudents.map(student => student.name).join(", ");

    // Generate the HTML list dynamically
    const studentHtmlList = removedStudents
        .map(student => `<li>${student.name}</li>`)
        .join("");

    return {
        subject: "⚠️ Student Unassigned from Your Tutorship",
        text: `Dear ${tutor.name},

The following student(s) have been removed from your tutorship:

${studentList}

If you have any questions, please contact the admin team.

Best regards,  
The Admin Team`,
        html: `
            <p>Dear <strong>${tutor.name}</strong>,</p>
            <p>The following student(s) have been removed from your tutorship:</p>
            <ul>${studentHtmlList}</ul>
            <p>If you have any questions, please contact the admin team.</p>
            <p>Best regards,</p>
            <p><strong>The Admin Team</strong></p>
        `
    };
};




export const allocationAssignmentEmail = (student, tutor) => {
    return {
        subject: "🎉 You’ve Been Assigned a New Tutor!",
        text: `Dear ${student.name},

We are pleased to inform you that you have been assigned to ${tutor.name} as your tutor. We look forward to your learning journey!

If you have any questions or need further assistance, please contact support.

Best regards,  
The Admin Team`,
        html: `
            <p>Dear <strong>${student.name}</strong>,</p>
            <p>We are pleased to inform you that you have been assigned to <strong>${tutor.name}</strong> as your tutor. We look forward to your learning journey!</p>
            <p>If you have any questions or need further assistance, please contact support.</p>
            <p>Best regards,</p>
            <p><strong>The Admin Team</strong></p>
        `
    };
};

export function tutorAssignmentNotificationEmail(student, tutor) {
    const subject = `New Student Assigned to You: ${student.name}`;

    const text = `
        Hello ${tutor.name},

        You have been assigned a new student: ${student.name}.
        
        Here are the details of the student:
        - Name: ${student.name}
        - Email: ${student.email}
        - Contact: ${student.contact}

        Please make sure to reach out to the student to schedule your first meeting.

        Best regards,
        Your Management Team
    `;

    const html = `
        <p>Hello ${tutor.name},</p>

        <p>You have been assigned a new student: <strong>${student.name}</strong>.</p>
        
        <p><strong>Student details:</strong><br>
        Name: ${student.name}<br>
        Email: ${student.email}<br>
        Contact: ${student.contact}</p>

        <p>Please make sure to reach out to the student to schedule your first meeting.</p>

        <p>Best regards,<br>Your Management Team</p>
    `;

    return { subject, text, html };
}
