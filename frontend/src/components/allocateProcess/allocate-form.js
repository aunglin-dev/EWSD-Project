import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Axios from "axios";
import { useSelector } from "react-redux";

export default function AllocateForm() {
  const { handleSubmit, setValue } = useForm();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [allocatedTutorStudents, setAllocatedTutorStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [AlreadyAllocatedStudents, setAlreadyAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //Get Data From Local Storage React
  const { currentUser } = useSelector((state) => state.auth);

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

        setTutors(tutorResponse.data);
        setStudents(studentResponse.data);

        const allocationsResponse = await Axios.get(
          "http://localhost:8000/api/allocations"
        );

        const allocations = tutorResponse.data.map((tutor) => {
          const allocations = allocationsResponse.data?.filter(
            (allocation) => allocation.tutor._id === tutor._id && allocation
          );
          return { tutor: tutor, allocations: allocations };
        });
        setAllocatedTutorStudents(allocations);
        // console.log("fetched Tutors:", tutorResponse.data);
        // console.log("fetched Students:", studentResponse.data);
        //console.log("fetched allocations:", allocationsResponse.data);
        setAlreadyAllocatedStudents(
          allocationsResponse.data.map((v) => v.student._id)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setSuccess(false);
      }
    };
    fetchData();
  }, [success]);

  const handleStudentChange = (event, newValue) => {
    setSelectedStudents(newValue);
    setValue("students", newValue);
  };

  const handleTutorChange = (event, newValue) => {
    setSelectedTutor(newValue);
    setValue("tutor", newValue);
    console.log("tutor", newValue);
  };

  const onSubmit = async (data) => {
    console.log("allocate form data=>", data);

    const allocationData = {
      tutor: data.tutor ? data.tutor._id : null,
      student: data.students ? data.students.map((student) => student._id) : [],
      createdStaffId: currentUser?._id,
      schedule: ["Friday"], //constant data for now
      status: "Pending", // constant data for now
      note: "This is allocation success ", // constant data for now
    };

    console.log(allocationData);
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/allocations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allocationData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Allocation Result:", result);
        setSuccessMsg("Allocation created successfully");
      } else {
        //error message from API
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Error allocating students:", error);
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };

  const handleRemoveAllocation = async (allocationId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this allocation ${allocationId}?`
    );

    if (isConfirmed) {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8000/api/allocations/${allocationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete allocation");
        } else {
          setSuccessMsg("Student removed successfully");
        }

        console.log(`Allocation ${allocationId} deleted successfully`);
      } catch (err) {
        alert("Failed to delete allocation. Please try again.");
      } finally {
        setLoading(false);
        setSuccess(true);
      }
    }
  };

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Box display="flex" flexDirection={isSmallestScreens && "column"} justifyContent="start" alignItems={isSmallestScreens ? "start" : "center"} gap="10px">
        <Button href="/allocate" type="button" variant="text" sx={{ padding: 0, fontSize: "16px" }} startIcon={<KeyboardBackspaceIcon sx={{ width: "18px", height: "18px" }} />}>
          {/* <span
          style={{
            display: "flex",
            alignItems: "center",
            padding: "7px 13px",
            borderRadius: "18px",
            backgroundColor: "#1270b8",
            gap: 3,
            color: "white",
          }}
        > */}
          Back
          {/* </span> */}
        </Button>
        {successMsg && (
          <span style={{ fontSize: "14px", fontWeight: "500", marginLeft: isSmallestScreens ? "0px" : "30px", padding: "5px 25px", borderRadius: "20px", backgroundColor: "#00c80040", }}>
            {successMsg}
          </span>
        )}
      </Box>
      <Box
        mt="40px"
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        <Box>
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>
            Tutor/Student Allocation
          </Typography>
          <Typography variant="subtitle1">
            Allocate the student to each tutor
          </Typography>
        </Box>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box>
            <Autocomplete
              id="tutor"
              options={tutors || []}
              getOptionLabel={(option) => option.name}
              value={selectedTutor}
              onChange={handleTutorChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Tutor"
                  variant="outlined"
                  sx={{
                    ".MuiInputLabel-root": {
                      fontSize: "16px",
                    },
                    ".MuiOutlinedInput-root": {
                      input: {
                        fontSize: "16px",
                        fontWeight: "400",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box
            display="flex"
            flexDirection={!isNonMobileScreens && "column"}
            justifyContent={isNonMobileScreens ? "space-between" : "start"}
            alignItems={isNonMobileScreens && "center"}
            gap="20px"
          >
            <Box flex="1">
              <Autocomplete
                multiple
                id="students"
                options={students || []}
                getOptionLabel={(option) => option.name}
                value={selectedStudents}
                onChange={handleStudentChange}
                renderOption={(props, option) => {
                  const isAllocated = AlreadyAllocatedStudents.includes(
                    option._id
                  );
                  return (
                    <li
                      {...props}
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: isAllocated ? "red" : "black",
                      }}
                    >
                      {option.name}
                    </li>
                  );
                }}
                renderTags={(value, getTagProps) => {
                  return value.map((student, index) => {
                    const isAllocated = AlreadyAllocatedStudents.includes(
                      student._id
                    );
                    return (
                      <span
                        key={student._id}
                        {...getTagProps({ index })}
                        style={{
                          margin: "3px",
                          padding: "5px 10px",
                          backgroundColor: "#e0e0e0",
                          color: isAllocated ? "red" : "black",
                          fontSize: "16px",
                          fontWeight: "400",
                        }}
                      >
                        {student.name}
                        <span
                          style={{
                            marginLeft: "5px",
                            cursor: "pointer",
                            fontSize: "small",
                            color: "gray",
                          }}
                          onClick={() => {
                            const newSelectedStudents = selectedStudents.filter(
                              (s) => s._id !== student._id
                            );
                            setSelectedStudents(newSelectedStudents);
                          }}
                        >
                          ✖
                        </span>
                      </span>
                    );
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Students"
                    variant="outlined"
                    sx={{
                      "& .MuiAutocomplete-tag": {
                        color: "black",
                      },
                      "& .MuiAutocomplete-tag.Mui-focused": {
                        backgroundColor: "lightgray",
                      },
                      ".MuiInputLabel-root": {
                        fontSize: "16px",
                      },
                      ".MuiOutlinedInput-root": {
                        input: {
                          fontSize: "16px",
                          fontWeight: "400",
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedTutor || selectedStudents.length === 0}
              >
                Allocate
              </Button>
            </Box>
          </Box>
          {errorMessage && (
            <Typography color="#E10022" fontSize="14px" >
              {errorMessage}
            </Typography>
          )}
        </form>

        <Box>
          {loading ? (
            <CircularProgress />
          ) : (
            selectedTutor && (
              <>
                {allocatedTutorStudents
                  ?.filter(
                    (selected) => selected.tutor._id === selectedTutor._id
                  )
                  .map((allocation, index) => (
                    <Box key={index}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="30px"
                        width="100%"
                      >
                        <Typography variant="h5" fontWeight="600">
                          Tutees
                        </Typography>
                        <Typography
                          variant={isSmallestScreens ? "caption" : "subtitle2"}
                          display="flex"
                          alignItems="center"
                          gap="4px"
                        >
                          <CircleIcon
                            sx={{
                              color: "#009900",
                              width: "18px",
                              height: "18px",
                            }}
                          />
                          {allocation.allocations.length} students assigned
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" gap="30px">
                        {allocation.allocations.length ? (
                          allocation.allocations.map((allocated) => (
                            <Box
                              key={index}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="end"
                              gap="10px"
                            >
                              <Box flex="2" overflow="hidden">
                                <Typography fontWeight="500">
                                  {allocated.student.name}
                                </Typography>
                                <Typography
                                  variant={
                                    isSmallestScreens ? "caption" : "subtitle2"
                                  }
                                  display="flex"
                                  alignItems="center"
                                  gap="4px"
                                >
                                  {allocated.student.email}
                                </Typography>
                              </Box>
                              <Box flex="1" display="flex" justifyContent="end">
                                <Button
                                  variant="outlined"
                                  sx={{
                                    backgroundColor: "#fff",
                                    boxShadow:
                                      "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    fontSize: isSmallestScreens && "16px",
                                  }}
                                  onClick={() =>
                                    handleRemoveAllocation(allocated._id)
                                  }
                                >
                                  Remove
                                </Button>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography>No tutee yet.</Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
              </>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
