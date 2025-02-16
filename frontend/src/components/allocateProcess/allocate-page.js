import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { STUDENT_OBJECTS, TUTOR_OBJECTS } from "../../constants/static_data";
import Card from "../home/card";

export default function AllocatePage() {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [allTutors, setAllTutors] = useState([]);
  const [allocatedTutess, setAllocatedTutees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allocationListdata, setAllocationListData] = useState([]);

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
      }

      setAllocatedTutees((prevState) =>
        prevState.filter((item) => item.allocationId !== allocationId)
      );
      console.log(`Allocation ${allocationId} deleted successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("allocaiton list=>", allocationListdata);

  //console.log("all tutors=>", allTutors);
  //console.log("selected tutor=>", selectedTutor?._id);
  console.log("allocated tutess", allocatedTutess?.allocation?.students);
  return (
    <Box
      paddingY={isNonMobileScreens ? "100px" : "70px"}
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Box
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "end",
          marginBottom: "40px",
        }}
      >
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
                options={allTutors || []}
                getOptionLabel={(option) => `${option.name}`}
                value={selectedTutor}
                onChange={handleTutorChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Tutor"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.name} ({option.email}){" "}
                  </li>
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
            {allocatedTutess.length < 1 && (
              <h3 style={{ width: "100%" }}>
                No allocated students for this tutor {selectedTutor?.name}
              </h3>
            )}
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, 10rem)"
              gridAutoFlow="dense"
              gap="30px"
              justifyContent="start"
              alignItems="start"
            >
              {/* {allocatedTutess.length < 1 && (
                <h3 style={{width:'100%'}}>
                  No allocated students for this tutor {selectedTutor?.name}
                </h3>
              )} */}
              {allocatedTutess?.allocation?.students.map((studentData) => (
                <Box position="relative">
                  <Card
                    sx={{ position: "relative" }}
                    title={studentData?.student?.name}
                    subtitle={studentData?.student?.email}
                    //addition={student.email}
                    imgSrc={studentData?.student?.img}
                    tutorName={selectedTutor?.name}
                  />
                  <RemoveCircleIcon
                    onClick={() =>
                      handleRemoveAllocation(
                        studentData?.student?.allocation_id
                      )
                    }
                    sx={{
                      position: "absolute",
                      cursor: "pointer",
                      right: "-10px",
                      top: "-10px",
                      width: "30px",
                      height: "30px",
                      color: "red",
                    }}
                  />
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
    </Box>
  );
}
