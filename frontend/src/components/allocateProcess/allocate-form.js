import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";

export default function AllocateForm({ tutors, students, studentsID }) {
  const { handleSubmit, setValue } = useForm();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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
      createdStaffId: "67a27305df934d75b205651a", // constant data for now
      schedule: ["Friday"], //constant data for now
      status: "Pending", // constant data for now
      note: "This is allocation success ", // constant data for now
    };

    try {
      const response = await fetch("http://localhost:8000/api/allocations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allocationData),
      });

      const result = await response.json();
      console.log("Allocation Result:", result);
    } catch (error) {
      console.error("Error allocating students:", error);
    }
  };

  return (
    <Box
      paddingY={isNonMobileScreens ? "100px" : "70px"}
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
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

        <Box sx={{ mb: 3 }}>
          <Autocomplete
            multiple
            id="students"
            options={students || []}
            getOptionLabel={(option) => option.name}
            value={selectedStudents}
            onChange={handleStudentChange}
            renderOption={(props, option) => {
              const isAllocated = studentsID.includes(option._id);
              return (
                <li {...props} style={{ color: isAllocated ? "red" : "black" }}>
                  {option.name}
                </li>
              );
            }}
            renderTags={(value, getTagProps) => {
              return value.map((student, index) => {
                const isAllocated = studentsID.includes(student._id);
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

        <Button
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
