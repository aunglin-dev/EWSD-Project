import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DescriptionIcon from '@mui/icons-material/Description';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from "react-redux";
import DashboardMeetingCard from "./dashboard-meeting-card";
import DashboardBlogCard from "./dashboard-blog-card";

export default function StudentDashboard() {
  const { id } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("current user data=>", currentUser);

  useEffect(() => {
    if (currentUser && currentUser.role === "Student") {
      setStudent(currentUser);
      console.log("Current User: ", currentUser);
    };

    if (id) {
      const fetchData = async () => {
        try {
          const studentResponse = await Axios.get(
            `http://localhost:8000/api/students/${id}`
          );

          const allocationsResponse = await Axios.get(
            "http://localhost:8000/api/allocations"
          );

          const student = {
            allocations: allocationsResponse.data?.filter(
              (allocation) => allocation.student._id === id && allocation
            ),
            ...studentResponse.data
          };
          setStudent(student);
          console.log("Student Data get by id: ", student);

        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      {currentUser.role !== "Student" &&
        <Button href="/staff-dashboard" type="button" variant="text" sx={{ padding: 0, fontSize: "16px" }} startIcon={<KeyboardBackspaceIcon sx={{ width: "18px", height: "18px" }} />}>
          Back
        </Button>
      }
      <Box
        mt={currentUser.role !== "Student" && "40px"}
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        <Box>
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>{student?.name}'s Dashboard</Typography>
          <Typography variant="subtitle1">Access student activity overview</Typography>
        </Box>
        <Box display="grid" gridTemplateColumns={isNonMobileScreens ? "repeat(2,minmax(550px, 700px))" : "minmax(0, 700px)"} gridAutoRows="minmax(350px, auto)" justifyContent="center" gap="20px">
          <DashboardMeetingCard
            title="This is meeting title"
            type="online"
            tutorName="John Doe"
            datetime="12/3/2/25 15:00"
            platform="Google Meet"
            location=""
            meetingLink=""
          />

          <Box
            paddingY="15px"
            paddingX={isSmallestScreens ? "15px" : "25px"}
            borderRadius="10px"
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
              <PermContactCalendarIcon sx={{ width: isSmallestScreens ? "16px" : "24px", height: isSmallestScreens ? "16px" : "24px" }} />
              <Typography variant={isSmallestScreens ? "h6" : "h4"}>Attendance Summary</Typography>
            </Box>
            <Box display="flex"
              flexDirection={isSmallestScreens ? "column" : "row"} justifyContent="space-between" alignItems="center" gap="7px">
              <Box flex="2" display="flex" flexDirection="column" justifyContent="center" paddingTop="50px" gap="40px">
                <Typography>80% attendance in the last 1 month.</Typography>
                <Box display="flex" flexDirection="column" justifyContent="start" gap="20px">
                  <Box display="flex" justifyContent="space-between" justifyItems="start" gap="6px">
                    <Box>
                      <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Last Attended</Typography>
                      <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">20/2/2025 22:00</Typography>
                    </Box>
                    <Box>
                      <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Upcoming Session</Typography>
                      <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">1/3/2025 12:00</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600" color="#E10022">Last Missed Session</Typography>
                    <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">27/2/2025 12:00</Typography>
                  </Box>
                </Box>
              </Box>
              <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <PieChart
                  sx={{ "& .MuiPieArc-root": { transform: "translateX(20%)" } }}
                  series={[
                    {
                      data: [
                        { id: 0, value: 20, label: "Absent", color: "#E10022" },
                        { id: 1, value: 80, label: "Present", color: "#69E106" },
                      ],
                    },
                  ]}
                  width={250}
                  height={250}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      labelStyle: { fontSize: 10 },
                      itemMarkWidth: 12,
                      itemMarkHeight: 12,
                    },
                  }}
                />
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
              <DescriptionIcon sx={{ width: isSmallestScreens ? "16px" : "24px", height: isSmallestScreens ? "16px" : "24px" }} />
              <Typography variant={isSmallestScreens ? "h6" : "h4"}>Recent Shared Document</Typography>
            </Box>
            <Box>
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: 3,
                  border: "1px solid #black",
                  padding: 3,
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        Uploaded By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell sx={{ borderLeft: "1px solid #d1cbcb" }}>
                        document.pdf
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        28/2/2025
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        John Doe
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                        {new Date(allocation.createdAt).getFullYear()}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #d1cbcb" }}>
                        <Button variant="contained" sx={{ textTransform: "none" }}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <DashboardBlogCard
            title="Very long blog title for blog named Class Discussions & Q&A"
            createdDateTime="27/2/2025 12:00"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque optio excepturi debitis eius laboriosam non aliquam, eos officiis iure odio?"
            commentCount="2"
            ownerName="John Doe"
          />

        </Box>
      </Box>
    </Box >
  );
}
