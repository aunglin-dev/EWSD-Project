import React, { useEffect, useState } from "react";
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
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setSelectedTutor(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allocationResponse = await Axios.get(
          "http://localhost:8000/api/allocations"
        );
        const tutorsResponse = await Axios.get(
          "http://localhost:8000/api/tutors"
        );
        setAllocations(allocationResponse.data);
        setTutors(tutorsResponse.data);
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
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Tutor List</Typography>
          <Typography variant="subtitle1">View all personal tutor information</Typography>
        </Box>
      </Box>

      <Box>
        <Box>
          <form>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                id="student"
                options={tutors || []}
                getOptionLabel={(option) => `${option.name}`}
                value={selectedTutor}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Tutor"
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
            : selectedTutor ?
              <TableContainer sx={{ mt: "50px", bgcolor: "#fff" }}>
                <Table sx={{ minWidth: 650, border: "2px solid #0A1F44" }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        tutor Name
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Total Students
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
                        {selectedTutor.name}
                      </TableCell>
                      <TableCell>
                        {selectedTutor.email}
                      </TableCell>
                      <TableCell>
                        {allocations.filter(allocation => allocation.tutor._id === selectedTutor._id).length > 0 ?
                          allocations.filter(allocation => allocation.tutor._id === selectedTutor._id)[0].length
                          : "0"}
                      </TableCell>
                      <TableCell>
                        {/* this is last active */}
                      </TableCell>
                      <TableCell>
                        <Button href={`/student-dashboard/${selectedTutor._id}`} variant="text" sx={{ textDecoration: "underline" }}>
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
                        tutor Name
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", bgcolor: "primary.main", color: "#fff", minWidth: "180px" }}>
                        Total Students
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
                    {tutors.map((tutor) => (
                      <TableRow key={tutor._id} sx={{ borderBottom: "2px solid #0A1F44" }}>
                        <TableCell >
                          {tutor.name}
                        </TableCell>
                        <TableCell>
                          {tutor.email}
                        </TableCell>
                        <TableCell>
                          {allocations.filter(allocation => allocation.tutor._id === tutor._id).length > 0 ?
                            allocations.filter(allocation => allocation.tutor._id === tutor._id).length
                            : "0"}
                        </TableCell>
                        <TableCell>
                          {/* this is last active */}
                        </TableCell>
                        <TableCell>
                          <Button href={`/tutor-dashboard/${tutor._id}`} variant="text" sx={{ textDecoration: "underline" }}>
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
