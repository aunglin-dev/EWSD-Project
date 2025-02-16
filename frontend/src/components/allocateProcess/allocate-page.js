import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { STUDENT_OBJECTS, TUTOR_OBJECTS } from "../../constants/static_data";
import Card from "../home/card"

export default function AllocatePage() {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [selectedTutor, setSelectedTutor] = useState(null);

  const handleTutorChange = (event, newValue) => {
    setSelectedTutor(newValue);
  };

  return (
    <Box
      paddingY={isNonMobileScreens ? "100px" : "70px"}
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Box style={{
        display: "flex",
        width: "100%",
        justifyContent: "end",
        marginBottom: "40px"
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/addAllocation")}
        >
          <AddIcon sx={{ marginRight: "10px" }} />
          <Typography>Allocate</Typography>
        </Button>
      </Box>

      <Box>
        <div>
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
          </form>
        </div>


        {selectedTutor ? (
          <Box>
            <Typography
              variant="h6"
              textTransform="uppercase"
              fontWeight="bold"
              marginBottom="20px"
            >
              Tutees
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, 10rem)"
              gridAutoFlow="dense"
              gap="30px"
              justifyContent="start"
              alignItems="start"
            >
              {STUDENT_OBJECTS.map(student => (
                <Box position="relative">
                  <Card sx={{ position: "relative" }} title={student.name} subtitle={student.department} addition={student.email} />
                  <RemoveCircleIcon onClick={() => console.log(`deleted allocation of ${student.name}`)} sx={{ position: "absolute", cursor: "pointer", right: "-10px", top: "-10px", width: "30px", height: "30px", color: "red" }} />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (

          <Typography
            variant="h6"
            textTransform="uppercase"
            fontWeight="bold"
            marginBottom="20px"
          >
            No tutor is selected.
          </Typography>

        )}
      </Box>
    </Box >
  );
}
