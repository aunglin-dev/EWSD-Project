import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Axios from "axios";
import { useSelector } from "react-redux";

export default function AllocateForm() {
  const { handleSubmit, setValue } = useForm();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [AlreadyAllocatedStudents, setAlreadyAllocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  //Get Data From Local Storage React
  const { currentStaff } = useSelector((state) => state.staff);

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
      }
    };
    fetchData();
  }, []);

  const handleStudentChange = (event, newValue) => {
    setSelectedStudents(newValue);
    setValue("students", newValue);
  };

  const handleTutorChange = (event, newValue) => {
    setSelectedTutor(newValue);
    setValue("tutor", newValue);
  };

  const onSubmit = async (data) => {
    console.log("allocate form data=>", data);

    const allocationData = {
      tutor: data.tutor ? data.tutor._id : null,
      student: data.students ? data.students.map((student) => student._id) : [],
      createdStaffId: currentStaff?._id,
      schedule: ["Friday"], //constant data for now
      status: "Pending", // constant data for now
      note: "This is allocation success ", // constant data for now
    };

    console.log(allocationData);
    try {
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
    }
  };

  return (
    <Box
      paddingY={isNonMobileScreens ? "100px" : "70px"}
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Button href="/allocate" type="button" sx={{ textTransform: "none" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            padding: "7px 13px",
            borderRadius: "18px",
            backgroundColor: "#1270b8",
            gap: 3,
            color: "white",
          }}
        >
          <KeyboardBackspaceIcon /> Back
        </span>
        {successMsg && (
          <span style={{ fontWeight: "bold", marginLeft: "30px" }}>
            {successMsg}
          </span>
        )}
      </Button>
      <Typography
        variant={isNonMobileScreens ? "h4" : "h6"}
        sx={{ marginBottom: "30px" }}
      >
        Add Allocation
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            id="tutor"
            options={tutors || []}
            getOptionLabel={(option) => option.name}
            value={selectedTutor}
            onChange={handleTutorChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Tutor" variant="outlined" />
            )}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Autocomplete
            multiple
            id="students"
            options={students || []}
            getOptionLabel={(option) => option.name}
            value={selectedStudents}
            onChange={handleStudentChange}
            renderOption={(props, option) => {
              const isAllocated = AlreadyAllocatedStudents.includes(option._id);
              return (
                <li {...props} style={{ color: isAllocated ? "red" : "black" }}>
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
                }}
              />
            )}
          />
        </Box>
        {errorMessage && (
          <Typography color="red" fontSize={"small"}>
            {errorMessage}
          </Typography>
        )}

        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          color="primary"
          type="submit"
          disabled={!selectedTutor || selectedStudents.length === 0}
        >
          Allocate
        </Button>
      </form>
    </Box>
  );
}
