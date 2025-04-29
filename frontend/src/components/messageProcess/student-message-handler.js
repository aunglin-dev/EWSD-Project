import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NoAthnicationCase from "../error/NoAuthenicationcase";

export default function StudentMessageHandler() {
  const { currentUser } = useSelector((state) => state.auth);
  const hasTutor =
    currentUser?.allocations && currentUser?.allocations.length > 0;

  if (currentUser?.role != "Student") return <NoAthnicationCase />;
  if (!hasTutor) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            padding: "20px",
            maxWidth: "500px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>No Tutor Assigned</h2>
          <p>You currently do not have a tutor assigned.</p>
          <p>Please contact your administrator for further assistance.</p>
        </div>
      </div>
    );
  }

  const tutorAllocation = currentUser.allocations[0];
  return (
    <Navigate
      to="/student/message-chat"
      state={{ otherPartyId: tutorAllocation.tutor }}
    />
  );
}
