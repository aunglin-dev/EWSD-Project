import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery
} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PushPinIcon from '@mui/icons-material/PushPin';
import AddIcon from "@mui/icons-material/Add";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/AxiosInstance";

export default function StaffDashboard() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1156px)");
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocatedTutorStudents, setAllocatedTutorStudents] = useState([]);
  const [alreadyAllocatedStudents, setAlreadyAllocatedStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8000/api/allocations"
        );
        const tutorResponse = await axiosInstance.get(
          "http://localhost:8000/api/tutors"
        );
        const studentResponse = await axiosInstance.get(
          "http://localhost:8000/api/students"
        );
        setData(response.data);
        setTutors(tutorResponse.data);
        setStudents(studentResponse.data);

        const allocations = tutorResponse.data.map((tutor) => {
          const allocations = response.data?.filter(
            (allocation) => allocation.tutor._id === tutor._id && allocation
          );
          return { tutor: tutor, allocations: allocations };
        });
        setAllocatedTutorStudents(allocations);

        setAlreadyAllocatedStudents(
          response.data.map((v) => v.student._id)
        );

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDeleteAllocation = async (allocationId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this allocation ${allocationId}?`
    );

    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `http://localhost:8000/api/allocations/${allocationId}`
        );
        if (response.status === 200) {
          setData((prevData) =>
            prevData.filter((allocation) => allocation._id !== allocationId)
          );
          console.log("Allocation deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting allocation:", error);
      }
    } else {
      console.log("Deletion canceled");
    }
  };

  if (!data || data.length === 0) {
    return <h1>Staff dashboard has no data</h1>;
  }

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        <Box display="flex" flexDirection={isSmallestScreens && "column"} justifyContent="space-between" alignItems={isSmallestScreens ? "start" : "center"} gap="18px">
          <Box>
            <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Welcome, Admin!</Typography>
            <Typography variant="subtitle1">Manage Allocations and Monitor System Activity</Typography>
          </Box>
          <Typography variant="subtitle2">Last Login: 3/7/2025 22:00</Typography>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={isNonMobileScreens ? "repeat(2,minmax(550px, 700px))" : "minmax(0, 700px)"}
          gridAutoRows="minmax(350px, auto)"
          justifyContent="center"
          gap="20px"
        >
          {/* First Row */}
          <Box
            display="grid"
            gridTemplateColumns={isSmallestScreens ? "1fr" : "1fr 1fr"}
            gridAutoRows="minmax(150px, auto)"
            justifyContent="center"
            gap="20px"
          >
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box display="flex" justifyContent="start" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                <PeopleAltIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Total Tutors</Typography>
              </Box>
              <Typography variant={isSmallestScreens ? "h5" : "h4"} color="primary.main">{tutors.length} Tutors</Typography>
              <Box display="flex" justifyContent="end">
                <IconButton>
                  <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </Box>
            </Box>
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box display="flex" justifyContent="start" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                <SchoolIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Total Students</Typography>
              </Box>
              <Typography variant={isSmallestScreens ? "h5" : "h4"} color="primary.main">{students.length} Students</Typography>
              <Box display="flex" justifyContent="end">
                <IconButton>
                  <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </Box>
            </Box>
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Box display="flex" justifyContent="space-between" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                <Typography variant={isSmallestScreens ? "h5" : "h4"} color="#E10022">{allocatedTutorStudents.filter(tutor => tutor.allocations.length == "0").length} Tutors</Typography>
                <ErrorIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
              </Box>
              <Typography mt="20px" variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Need student allocations</Typography>
              <Box display="flex" justifyContent="end">
                <IconButton>
                  <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </Box>
            </Box>
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Box display="flex" justifyContent="space-between" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                <Typography variant={isSmallestScreens ? "h5" : "h4"} color="#E10022">{students.length - alreadyAllocatedStudents.length} Students</Typography>
                <ErrorIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
              </Box>
              <Typography mt="20px" variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Need tutor allocations</Typography>
              <Box display="flex" justifyContent="end">
                <IconButton>
                  <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
              <PushPinIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
              <Typography variant={isSmallestScreens ? "h6" : "h4"}>Unallocated Tutors</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap="25px"
              mt="20px"
            >
              {allocatedTutorStudents.filter(allocatedTutor => (
                allocatedTutor.allocations.length < 1)).length > 0 ? allocatedTutorStudents.filter(allocatedTutor => (
                  allocatedTutor.allocations.length < 1))?.map((allocation, index) =>
                    <Box key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      borderRadius="3px"
                      gap="10px"
                    >
                      <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                        justifyContent="space-between" alignContent="center" flex="2">
                        <Box>
                          <Typography fontSize={isSmallestScreens && "16px"} fontWeight="500">{allocation.tutor.name}</Typography>
                          <Typography fontSize={isSmallestScreens ? "13px" : "14px"}>{allocation.tutor.name}</Typography>
                        </Box>
                      </Box>
                      <Box flex="1" display="flex" justifyContent="end">

                        <Button variant="outlined" sx={{
                          backgroundColor: "#fff",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          fontSize: isSmallestScreens && "16px",
                        }}
                          href={`/allocateReallocate/${allocation.tutor._id}`}
                          startIcon={<AddIcon sx={{ width: "24px", height: "24px" }} />}
                        >Allocate</Button>

                      </Box>
                    </Box>
                  ) : (<Typography>No unallocated tutor.</Typography>)}
            </Box>
          </Box>

          {/* Second Row */}
          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box>
              <Typography variant={isNonMobileScreens ? "h4" : "h5"}>Most Active Users</Typography>
              <Typography variant="subtitle1" fontSize="14px">Most active users of the platform within a month</Typography>
            </Box>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["User 1", "User 2", "User 3", "User 4", "User 5"]
                }
              ]}
              yAxis={[
                {
                  scaleType: "linear",
                  valueFormatter: (value) => `${value} hr`
                }
              ]}
              series={[{ data: [22, 18, 20, 3, 3], color: "#0A1F44" }]}
              width={isNonMobileScreens ? 500 : isSmallestScreens ? 300 : 420}
              height={400}
            />
          </Box>

          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box display="flex" flexDirection={isSmallestScreens && "column"} justifyContent="space-between" gap="15px">
              <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                <PushPinIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
                <Typography variant={isSmallestScreens ? "h6" : "h4"}>Unallocated Students</Typography>
              </Box>
              <Box>
                <Button variant="outlined" sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  fontSize: isSmallestScreens && "16px",
                }}
                  href="/allocate"
                  startIcon={<AddIcon sx={{ width: "24px", height: "24px" }} />}
                >Allocate</Button>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap="25px"
              mt="20px"
            >
              {students.filter(student => (!alreadyAllocatedStudents.includes(student._id))).length > 0
                ? students.filter(student => (!alreadyAllocatedStudents.includes(student._id)))?.map((student, index) =>
                  <Box key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    borderRadius="3px"
                    gap="10px"
                  >
                    <Box display="flex" flexDirection={isNonMobileScreens ? "row" : "column"}
                      justifyContent="space-between" alignContent="center" flex="2">
                      <Box>
                        <Typography fontSize={isSmallestScreens && "16px"} fontWeight="500">{student.name}</Typography>
                        <Typography fontSize={isSmallestScreens ? "13px" : "14px"}>{student.name}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (<Typography>No unallocated student.</Typography>)}
            </Box>
          </Box>

          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box>
              <Typography variant={isNonMobileScreens ? "h4" : "h5"}>Most View Pages</Typography>
              <Typography variant="subtitle1" fontSize="14px">Most view pages of the platform within a month</Typography>
            </Box>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Page 1", "Page 2", "Page 3", "Page 4", "Page 5"]
                }
              ]}
              yAxis={[
                {
                  scaleType: "linear",
                }
              ]}
              series={[{ data: [750, 600, 650, 100, 100], color: "#0A1F44" }]}
              width={isNonMobileScreens ? 500 : isSmallestScreens ? 300 : 420}
              height={400}
            />
          </Box>
          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box width="100%">
              <Typography variant={isNonMobileScreens ? "h4" : "h5"}>Most Used Meeting Platform</Typography>
              <Typography variant="subtitle1" fontSize="14px">Most used platforms for tutor/student meetings</Typography>
            </Box>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 60, label: 'Zoom', color: "#0A1F44" },
                    { id: 1, value: 20, label: 'Google Meet', color: "#4A90E2" },
                    { id: 2, value: 10, label: 'Microsoft Team', color: "#939090" },
                    { id: 3, value: 5, label: 'Other', color: "#CBCBCB" },
                  ],
                },
              ]}
              width={isSmallestScreens ? 280 : 400}
              height={200}
              slotProps={{
                legend: {
                  direction: "column",
                  labelStyle: { fontSize: 12 },
                  itemMarkWidth: 14,
                  itemMarkHeight: 14,
                },
              }}
            />
          </Box>

        </Box>
      </Box>
    </Box >
  );
}
