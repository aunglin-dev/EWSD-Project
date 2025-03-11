import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Axios from "axios";
import { useSelector } from "react-redux";

export default function AllocatePage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setSelectedStudent(newValue);
    console.log("selected student", newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allocationResponse = await Axios.get(
          "http://localhost:8000/api/allocations"
        );
        const studentsResponse = await Axios.get(
          "http://localhost:8000/api/students"
        );
        setAllocations(allocationResponse.data);
        setStudents(studentsResponse.data);
        console.log(allocationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Box
        display="flex"
        flexDirection={isNonMobileScreens ? "row" : "column"}
        width="100%"
        justifyContent="space-between"
        alignItems={isNonMobileScreens ? "center" : "start"}
        gap="20px"
        marginBottom="40px"
      >
        <Box>
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Student List</Typography>
          <Typography variant="subtitle1">View all student information</Typography>
        </Box>
      </Box>

      <Box>
        <Box>
          <form>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                id="student"
                options={students || []}
                getOptionLabel={(option) => `${option.name}`}
                value={selectedStudent}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Student"
                    variant="outlined"
                    sx={{
                      ".MuiInputLabel-root": {
                        fontSize: "16px"
                      },
                      ".MuiOutlinedInput-root": {
                        input: {
                          fontSize: "16px",
                          fontWeight: "400"
                        }
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} style={{ fontSize: "16px", fontWeight: "400" }}>
                    {option.name}
                  </li>
                )}

              />
            </Box>
          </form>
        </Box>

        {
          loading ?
            <CircularProgress />
            : selectedStudent ?
              <TableContainer sx={{ mt: "50px", bgcolor: "#fff" }}>
                <Table sx={{ minWidth: 650, border: "2px solid #0A1F44" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Student Name
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Personal Tutor
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Total Meetings
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "160px" }}>
                        Last Active
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "200px" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ borderBottom: "2px solid #0A1F44" }}>
                      <TableCell >
                        {selectedStudent.name}
                      </TableCell>
                      <TableCell>
                        {selectedStudent.email}
                      </TableCell>
                      <TableCell >
                        {allocations.filter(allocation => allocation.student._id === selectedStudent._id).length > 0 ?
                          allocations.filter(allocation => allocation.student._id === selectedStudent._id)[0].tutor.name
                          : "No tutor allocated."}
                      </TableCell>
                      <TableCell>
                        {allocations.filter(allocation => allocation.student._id === selectedStudent._id).length > 0 ?
                          allocations.filter(allocation => allocation.student._id === selectedStudent._id)[0].meetings.length
                          : "0"}
                      </TableCell>
                      <TableCell>
                        {/* this is last active */}
                      </TableCell>
                      <TableCell>
                        <Button href={`/student-dashboard/${selectedStudent._id}`} variant="text" sx={{ textDecoration: "underline" }}>
                          View Dashboard
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              : <TableContainer sx={{ mt: "50px", bgcolor: "#fff" }}>
                <Table sx={{ minWidth: 650, border: "2px solid #0A1F44" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Student Name
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Personal Tutor
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Total Meetings
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "160px" }}>
                        Last Active
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "200px" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id} sx={{ borderBottom: "2px solid #0A1F44" }}>
                        <TableCell >
                          {student.name}
                        </TableCell>
                        <TableCell>
                          {student.email}
                        </TableCell>
                        <TableCell >
                          {allocations.filter(allocation => allocation.student._id === student._id).length > 0 ?
                            allocations.filter(allocation => allocation.student._id === student._id)[0].tutor.name
                            : "No tutor allocated."}
                        </TableCell>
                        <TableCell>
                          {allocations.filter(allocation => allocation.student._id === student._id).length > 0 ?
                            allocations.filter(allocation => allocation.student._id === student._id)[0].meetings.length
                            : "0"}
                        </TableCell>
                        <TableCell>
                          {/* this is last active */}
                        </TableCell>
                        <TableCell>
                          <Button href={`/student-dashboard/${student._id}`} variant="text" sx={{ textDecoration: "underline" }}>
                            View Dashboard
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
        }
      </Box>
    </Box >
  );
}
