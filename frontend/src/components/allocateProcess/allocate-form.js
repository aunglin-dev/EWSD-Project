import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Typography,
  Box,
  useMediaQuery
} from "@mui/material";
import { STUDENT_OBJECTS, TUTOR_OBJECTS } from "../../constants/static_data";

export default function AllocateForm() {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");


  const handleStudentChange = (event, newValue) => {
    setSelectedStudents(newValue);
  };

  const handleTutorChange = (event, newValue) => {
    setSelectedTutor(newValue);
  };

  const handleAllocate = () => {
    console.log("Allocated Students:", selectedStudents);
    console.log("To Tutor:", selectedTutor);
  };
  return (
    <Box
      paddingY={isNonMobileScreens ? "100px" : "70px"}
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Typography variant={isNonMobileScreens ? "h4" : "h6"} sx={{ marginBottom: "30px" }}>Add Allocation</Typography>
      <form>
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
          onClick={handleAllocate}
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
    </Box>
  );
}
