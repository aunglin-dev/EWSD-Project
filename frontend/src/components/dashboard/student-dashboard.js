import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  IconButton,
  CircularProgress
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from "react-redux";
import StudentDashboardMeetingCard from "./student-dashboard-meeting-card";
import DashboardCommentCard from "./dashboard-comment-card";

export default function StudentDashboard() {
  const { id } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [student, setStudent] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // console.log("current user data=>", currentUser);

  useEffect(() => {
    if (currentUser && currentUser.role === "Student") {
      setStudent(currentUser);
      setLoading(false);
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

          const meetingsResponse = await Axios.get(
            `http://localhost:8000/api/meetings/allocation/${student.allocations[0]._id}`
          );

          setMeeting(meetingsResponse.data);

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
      {currentUser?.role !== "Student" &&
        <Button href="/students" type="button" variant="text" sx={{ padding: 0, fontSize: "16px" }} startIcon={<KeyboardBackspaceIcon sx={{ width: "18px", height: "18px" }} />}>
          Back
        </Button>
      }
      <Box
        mt={currentUser?.role !== "Student" && "40px"}
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        {loading ?
          <CircularProgress />
          : (
            <>
              <Box display="flex" jflexDirection={isSmallestScreens && "column"} justifyContent="space-between" alignItems={isSmallestScreens ? "start" : "center"} gap="18px">
                <Box>
                  <Typography variant={isNonMobileScreens ? "h2" : "h3"}>{student?.name}'s Dashboard</Typography>
                  {currentUser?.role !== "Student" ?
                    <Typography variant="subtitle1">Access student activity overview</Typography>
                    :
                    <Typography variant="subtitle1">Stay on track with your meetings and progress.</Typography>
                  }
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
                <StudentDashboardMeetingCard
                  title="This is meeting title"
                  type="online"
                  tutorName="John Doe"
                  datetime="12/3/2/25 15:00"
                  platform="Google Meet"
                  location=""
                  meetingLink=""
                />

                {/* Attendance Card */}
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
                    <Box flex="1">
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

                {/* Document Card */}
                <Box
                  paddingY="15px"
                  paddingX={isSmallestScreens ? "15px" : "25px"}
                  borderRadius="10px"
                  bgcolor="#fff"
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  gap="30px"
                >
                  <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                    <DescriptionIcon sx={{ width: isSmallestScreens ? "16px" : "24px", height: isSmallestScreens ? "16px" : "24px" }} />
                    <Typography variant={isSmallestScreens ? "h6" : "h4"}>Recent Shared Document</Typography>
                  </Box>
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", minWidth: "150px" }}>
                            Name
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500" }}>
                            Date
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500", minWidth: "150px" }}>
                            Uploaded By
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: isSmallestScreens ? "14px" : "18px", fontWeight: "500" }}>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key="1" sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            document.pdf
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            28/2/2025
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            John Doe
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            <IconButton>
                              <DownloadIcon sx={{ color: "#000", width: "24px", height: "24px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key="2" sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            Lecture Notes.pdf
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            28/2/2025
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            John Doe
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            <IconButton>
                              <DownloadIcon sx={{ color: "#000", width: "24px", height: "24px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key="3" sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            document.pdf
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            28/2/2025
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            John Doe
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            <IconButton>
                              <DownloadIcon sx={{ color: "#000", width: "24px", height: "24px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key="4" sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            document.pdf
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            28/2/2025
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            John Doe
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            <IconButton>
                              <DownloadIcon sx={{ color: "#000", width: "24px", height: "24px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key="5" sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            document.pdf
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            28/2/2025
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            John Doe
                          </TableCell>
                          <TableCell sx={{ paddingBottom: "5px", paddingTop: "15px", fontSize: "14px", fontWeight: "400" }}>
                            <IconButton>
                              <DownloadIcon sx={{ color: "#000", width: "24px", height: "24px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box display="flex" justifyContent="end">
                    <Button variant="text" sx={{ fontSize: isSmallestScreens ? "14px" : "16px", "&:hover": { bgcolor: "inherit" } }} endIcon={<ArrowCircleRightIcon />}>View all</Button>
                  </Box>
                </Box>

                {/* Comment Card */}
                <Box
                  paddingY="15px"
                  paddingX={isSmallestScreens ? "15px" : "25px"}
                  borderRadius="10px"
                  bgcolor="#fff"
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  gap="35px"
                >
                  <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                    <RateReviewIcon sx={{ width: isSmallestScreens ? "16px" : "24px", height: isSmallestScreens ? "16px" : "24px" }} />
                    <Typography variant={isSmallestScreens ? "h6" : "h4"}>Recent Comments</Typography>
                  </Box>
                  <DashboardCommentCard
                    title="Very long blog title for blog named Class Discussions & Q&A"
                    createdDateTime="27/2/2025 12:00"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque optio excepturi debitis eius laboriosam non aliquam, eos officiis iure odio?"
                    commentCount="2"
                    ownerName="John Doe"
                  />
                  <DashboardCommentCard
                    title="Very long blog title for blog named Class Discussions & Q&A"
                    createdDateTime="27/2/2025 12:00"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque optio excepturi debitis eius laboriosam non aliquam, eos officiis iure odio?"
                    commentCount="2"
                    ownerName="John Doe"
                  />
                </Box>
              </Box>
            </>
          )}
      </Box>
    </Box >
  );
}
