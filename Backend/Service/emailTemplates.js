﻿export const tutorAssignmentEmail = (tutor) => {
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



export const tutorNotificationEmail = (tutor, addedStudents, removedStudents) => {
    return {
        subject: "Student Allocation Update - eTutoring System",
        text: `Dear ${tutor.name},

Your student allocation has been updated in the eTutoring system.

🔹 Added Students: ${addedStudents.length > 0 ? addedStudents.join(", ") : "None"}
🔹 Removed Students: ${removedStudents.length > 0 ? removedStudents.join(", ") : "None"}

Please log in to your account to review the changes.

Best regards,  
University eTutoring Team`,

        html: `
            <p>Dear ${tutor.name},</p>
            <p>Your student allocation has been updated in the <strong>eTutoring</strong> system.</p>
            <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Added Students</th>
                    <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Removed Students</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${addedStudents.length > 0 ? addedStudents.join("<br>") : "None"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${removedStudents.length > 0 ? removedStudents.join("<br>") : "None"}</td>
                </tr>
            </table>
            <p>Please <a href="https://etutoring.university.com" style="color: #007bff;">log in to your account</a> to review the changes.</p>
            <p>Best regards,<br><strong>University eTutoring Team</strong></p>
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
                <li><strong>Date:</strong> ${meeting.date.toDateString()}</li>
                <li><strong>Time:</strong> ${meeting.time}</li>
                <li><strong>Type:</strong> ${meeting.meetingType}</li>
                ${meeting.meetingType === 'virtual' ? `<li><strong>Link:</strong> <a href="${meeting.virtualLink}">${meeting.virtualLink}</a></li>` : `<li><strong>Location:</strong> ${meeting.location}</li>`}
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
                <li><strong>New Date:</strong> ${meeting.date.toDateString()}</li>
                <li><strong>New Time:</strong> ${meeting.time}</li>
                <li><strong>Type:</strong> ${meeting.meetingType}</li>
                ${meeting.meetingType === 'virtual' ? `<li><strong>Link:</strong> <a href="${meeting.virtualLink}">${meeting.virtualLink}</a></li>` : `<li><strong>Location:</strong> ${meeting.location}</li>`}
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
                    <li><strong>Date:</strong> ${meeting.date.toDateString()}</li>
                    <li><strong>Time:</strong> ${meeting.time}</li>
                    ${meeting.meetingType === 'virtual'
                    ? `<li><strong>Virtual Link:</strong> ${meeting.virtualLink}</li>`
                    : `<li><strong>Location:</strong> ${meeting.location}</li>`}
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
                    <li><strong>Date:</strong> ${meeting.date.toDateString()}</li>
                    <li><strong>Time:</strong> ${meeting.time}</li>
                    ${meeting.meetingType === 'virtual'
                    ? `<li><strong>Virtual Link:</strong> ${meeting.virtualLink}</li>`
                    : `<li><strong>Location:</strong> ${meeting.location}</li>`}
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
                    <li><strong>New Date:</strong> ${meeting.date.toDateString()}</li>
                    <li><strong>New Time:</strong> ${meeting.time}</li>
                    ${meeting.meetingType === 'virtual'
                    ? `<li><strong>Updated Virtual Link:</strong> ${meeting.virtualLink}</li>`
                    : `<li><strong>Updated Location:</strong> ${meeting.location}</li>`}
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
                    <li><strong>Cancelled Date:</strong> ${meeting.date.toDateString()}</li>
                    <li><strong>Cancelled Time:</strong> ${meeting.time}</li>
                    ${meeting.meetingType === 'virtual'
                    ? `<li><strong>Virtual Link:</strong> ${meeting.virtualLink}</li>`
                    : `<li><strong>Location:</strong> ${meeting.location}</li>`}
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


