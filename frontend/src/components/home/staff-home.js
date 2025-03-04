import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STUDENT_OBJECTS } from "../../constants/static_data";
import Card from "./card";
import { useSelector } from "react-redux";

export default function StaffHome() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [selectedStudents, setSelectedStudents] = useState([]);
  // const { currentStaff } = useSelector((state) => state.staff);
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleStudentChange = (event, newValue) => {
    setSelectedStudents(newValue);
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
        Welcome, {currentUser?.name}
      </Typography>

      <Box>
        <div>
          <form>
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
                    label="Search Students"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </form>
        </div>

        {selectedStudents.length > 0 ? (
          <Box>
            <Typography
              variant="h6"
              textTransform="uppercase"
              fontWeight="bold"
              marginBottom="20px"
            >
              Students
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, 10rem)"
              gridAutoFlow="dense"
              gap="30px"
              justifyContent="start"
              alignItems="start"
            >
              {selectedStudents.map((student) => (
                <div
                  key={student.email}
                  onClick={() => navigate(`/studentDashboard/${student.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    title={student.name}
                    subtitle={student.department}
                    addition={student.email}
                  />
                </div>
              ))}
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              textTransform="uppercase"
              fontWeight="bold"
              marginBottom="20px"
            >
              Students
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, 10rem)"
              gridAutoFlow="dense"
              gap="30px"
              justifyContent="start"
              alignItems="start"
            >
              {STUDENT_OBJECTS.map((student) => (
                <div
                  key={student.email}
                  onClick={() => navigate(`/studentDashboard/${student.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    title={student.name}
                    subtitle={student.department}
                    addition={student.email}
                  />
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
