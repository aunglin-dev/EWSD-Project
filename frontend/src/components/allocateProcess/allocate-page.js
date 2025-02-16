import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import Axios from "axios";
import AllocateForm from "./allocate-form";
import AllocateTable from "./allocate-table";

export default function AllocatePage() {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [AlreadyAllocatedStudents, setAlreadyAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocationData, setAllocationData] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchData = async () => {
      try {
        const tutorResponse = await Axios.get(
          "http://localhost:8000/api/tutors"
        );
        console.log("end fetch tutor");
        const studentResponse = await Axios.get(
          "http://localhost:8000/api/students"
        );
        const allocationsResponse = await Axios.get(
          "http://localhost:8000/api/allocations"
        );

        // console.log("fetched Tutors:", tutorResponse.data);
        // console.log("fetched Students:", studentResponse.data);
        //console.log("fetched allocations:", allocationsResponse.data);
        setTutors(tutorResponse.data);
        setStudents(studentResponse.data);
        setAlreadyAllocatedStudents(
          allocationsResponse.data.map((v) => v.student._id)
        );
        setAllocationData(allocationsResponse.data.map((v) => v));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Allocate Students to Tutor
      </Typography>
      <AllocateForm
        tutors={tutors}
        students={students}
        studentsID={AlreadyAllocatedStudents}
      />
      <AllocateTable tutors={tutors} allocationResponse={allocationData} />
    </div>
  );
}
