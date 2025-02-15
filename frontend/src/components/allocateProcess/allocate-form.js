import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { STUDENT_OBJECTS, TUTOR_OBJECTS } from "../../constants/static_data";

export default function AllocateForm() {
  const { handleSubmit, setValue, control } = useForm();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

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
      tutorId: data.tutor._id,
      students: data.students.map((student) => student._id),
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            id="tutor"
            options={TUTOR_OBJECTS}
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
            options={STUDENT_OBJECTS}
            getOptionLabel={(option) => option.name}
            value={selectedStudents}
            onChange={handleStudentChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Students"
                variant="outlined"
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

        {selectedStudents.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Selected Students:
            </Typography>
            <ul>
              {selectedStudents.map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </form>
    </div>
  );
}
