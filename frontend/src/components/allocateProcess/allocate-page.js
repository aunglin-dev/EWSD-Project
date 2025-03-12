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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CircleIcon from '@mui/icons-material/Circle';
import { useSelector } from "react-redux";

export default function AllocatePage() {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [allTutors, setAllTutors] = useState([]);
  const [allocatedTutess, setAllocatedTutees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allocationListdata, setAllocationListData] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [notAssigned, setNotAssigned] = useState(false);

  const handleTutorChange = (event, newValue) => {
    setSelectedTutor(newValue);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchTutors = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tutors");
        if (!response.ok) {
          throw new Error("Failed to fetch tutors");
        }
        const data = await response.json();
        setAllTutors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    if (selectedTutor) {
      setLoading(true);
      setError(null);

      const fetchAllocatedStudents = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/allocations/tutor/${selectedTutor?._id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch allocated tutees");
          }
          const data = await response.json();
          setAllocatedTutees(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAllocatedStudents();
    }
  }, [selectedTutor]);

  useEffect(() => {
    const allocationList = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allocations");
        if (!response.ok) {
          throw new Error("Failed to fetch allocation list");
        }
        const data = await response.json();
        setAllocationListData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    allocationList();
  }, []);

  const handleRemoveAllocation = async (allocationId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this allocation ${allocationId}?`
    );

    if (isConfirmed) {
      try {
        setLoading(true);
        setAllocatedTutees((prevState) => {
          return {
            ...prevState,
            allocation: {
              ...prevState.allocation,
              students: prevState.allocation.students.filter(
                (item) => item.allocationId !== allocationId
              ),
            },
          };
        });
        const response = await fetch(
          `http://localhost:8000/api/allocations/${allocationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete allocation");
        }

        console.log(`Allocation ${allocationId} deleted successfully`);
      } catch (err) {
        setAllocatedTutees((prevState) => {
          return {
            ...prevState,
            allocation: {
              ...prevState.allocation,
              students: [...prevState.allocation.students, { allocationId }],
            },
          };
        });

        setError(err.message);
        alert("Failed to delete allocation. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const allocatedTutorStudents = allTutors.map(tutor => {
    const allocations = allocationListdata.filter(allocation => allocation.tutor._id === tutor._id && allocation.student);
    return { "tutor": tutor, "allocations": allocations }
  });

  // console.log("allocaiton list=>", allocationListdata);

  // console.log("all tutors=>", allTutors);
  // console.log("selected tutor=>", selectedTutor?._id);
  // console.log("allocated tutess", allocatedTutess?.allocation?.students);
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
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Tutor/Student Allocation</Typography>
          <Typography variant="subtitle1">Allocate the student to each tutor</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          href="/addAllocation"
          startIcon={<AddIcon sx={{ width: "24px", height: "24px" }} />}
        >
          Allocate
        </Button>
      </Box>

      <Box>
        <div>
          <form>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                id="tutor"
                options={allTutors || []}
                getOptionLabel={(option) => `${option.name}`}
                value={selectedTutor}
                onChange={handleTutorChange}
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
                    {option.name} ({option.email}){" "}
                  </li>
                )}

              />
            </Box>
          </form>
        </div>



        {loading ?
          <CircularProgress />
          :
          selectedTutor ? (
            <>
              {allocatedTutorStudents?.filter((selected) => (
                selected.tutor._id === selectedTutor._id)).map((allocation, index) => (
                  <Box Box key={index} display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={isNonMobileScreens ? "12px 30px" : isSmallestScreens ? "5px 7px" : "10px 15px"}
                    backgroundColor="#d9d9d9"
                    borderRadius="3px"
                  >
                    <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                      justifyContent="space-between" alignContent="center" flex="2">
                      <Typography fontSize={isSmallestScreens && "16px"}>{allocation.tutor.name}</Typography>
                      {allocation.allocations.length ? (
                        <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="flex" alignItems="center" gap="4px">
                          <CircleIcon sx={{ display: isSmallestScreens && "none", color: "#009900", width: "18px", height: "18px" }} />
                          {allocation.allocations.length} students assigned
                        </Typography>
                      ) : (
                        <Typography variant={isSmallestScreens ? "caption" : "subtitle2"}>Not assigned</Typography>
                      )}
                    </Box>
                    <Box flex="1" display="flex" justifyContent="end">

                      <Button variant="outlined"
                        sx={{
                          backgroundColor: "#fff",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          fontSize: isSmallestScreens && "16px",
                        }}
                        onClick={() => navigate(`/allocateReallocate/${allocation.tutor._id}`)}
                      >
                        {allocation.allocations.length ? "Reallocate" : "Allocate"}
                      </Button>

                    </Box>
                  </Box>
                ))}
            </>
          ) : (
            <>
              <Box display="flex" justifyContent="start" alignItems="center" gap="15px" mt="50px">
                <Button variant={!assigned && !notAssigned ? "contained" : "outlined"} sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }} onClick={() => { setAssigned(false); setNotAssigned(false); }}>All</Button>
                <Button variant={assigned ? "contained" : "outlined"} sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }} onClick={() => { setAssigned(true); setNotAssigned(false); }}>Assigned</Button>
                <Button variant={notAssigned ? "contained" : "outlined"} sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }} onClick={() => { setAssigned(false); setNotAssigned(true); }}>Not Assigned</Button>
              </Box>
              {allocatedTutorStudents ? (
                <Box
                  display="flex" flexDirection="column"
                  gap="10px"
                  mt="20px"
                >
                  {assigned ? (
                    <>
                      {allocatedTutorStudents.filter(assigned => (
                        assigned.allocations.length)).length > 0 ? allocatedTutorStudents.filter(assigned => (
                          assigned.allocations.length))?.map((allocation, index) =>
                            <Box key={index} display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              padding={isNonMobileScreens ? "12px 30px" : isSmallestScreens ? "5px 7px" : "10px 15px"}
                              backgroundColor="#d9d9d9"
                              borderRadius="3px"
                            >
                              <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                                justifyContent="space-between" alignContent="center" flex="2">
                                <Typography fontSize={isSmallestScreens && "16px"}>{allocation.tutor.name}</Typography>

                                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="flex" alignItems="center" gap="4px">
                                  <CircleIcon sx={{ display: isSmallestScreens && "none", color: "#009900", width: "18px", height: "18px" }} />
                                  {allocation.allocations.length} students assigned
                                </Typography>

                              </Box>
                              <Box flex="1" display="flex" justifyContent="end">

                                <Button variant="outlined"
                                  sx={{
                                    backgroundColor: "#fff",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    fontSize: isSmallestScreens && "16px",
                                  }}
                                  href={`/allocateReallocate/${allocation.tutor._id}`}
                                >Reallocate</Button>

                              </Box>
                            </Box>
                          ) : (<Typography>No assigned tutor.</Typography>)}
                    </>
                  ) : notAssigned ? (
                    <>
                      {allocatedTutorStudents.filter(assigned => (
                        assigned.allocations.length < 1)).length > 0 ? allocatedTutorStudents.filter(assigned => (
                          assigned.allocations.length < 1))?.map((allocation, index) =>
                            <Box key={index} display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              padding={isNonMobileScreens ? "12px 30px" : isSmallestScreens ? "5px 7px" : "10px 15px"}
                              backgroundColor="#d9d9d9"
                              borderRadius="3px"
                              gap="10px"
                            >
                              <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                                justifyContent="space-between" alignContent="center" flex="2">
                                <Typography fontSize={isSmallestScreens && "16px"}>{allocation.tutor.name}</Typography>

                                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"}>Not assigned</Typography>

                              </Box>
                              <Box flex="1" display="flex" justifyContent="end">

                                <Button variant="outlined" sx={{
                                  backgroundColor: "#fff",
                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                  fontSize: isSmallestScreens && "16px",
                                }}
                                  href={`/allocateReallocate/${allocation.tutor._id}`}
                                >Allocate</Button>

                              </Box>
                            </Box>
                          ) : (<Typography>No not assigned tutor.</Typography>)}
                    </>
                  ) : (
                    <>
                      {allocatedTutorStudents.map((allocation, index) =>
                        <Box key={index} display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          padding={isNonMobileScreens ? "12px 30px" : isSmallestScreens ? "5px 7px" : "10px 15px"}
                          backgroundColor="#d9d9d9"
                          borderRadius="3px"
                        >
                          <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                            justifyContent="space-between" alignContent="center" flex="2">
                            <Typography fontSize={isSmallestScreens && "16px"}>{allocation.tutor.name}</Typography>
                            {allocation.allocations.length ? (
                              <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="flex" alignItems="center" gap="4px">
                                <CircleIcon sx={{ display: isSmallestScreens && "none", color: "#009900", width: "18px", height: "18px" }} />
                                {allocation.allocations.length} students assigned
                              </Typography>
                            ) : (
                              <Typography variant={isSmallestScreens ? "caption" : "subtitle2"}>Not assigned</Typography>
                            )}
                          </Box>
                          <Box flex="1" display="flex" justifyContent="end">

                            <Button variant="outlined"
                              sx={{
                                backgroundColor: "#fff",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                fontSize: isSmallestScreens && "16px",
                              }}
                              href={`/allocateReallocate/${allocation.tutor._id}`}
                            >{allocation.allocations.length ? "Reallocate" : "Allocate"}</Button>

                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              ) : (<Typography>No tutor/student allocation.</Typography>)}
            </>
          )}
      </Box>
    </Box >
  );
}
