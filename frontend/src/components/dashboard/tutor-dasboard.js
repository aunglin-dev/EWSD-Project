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
  Paper,
  useMediaQuery,
  IconButton,
  CircularProgress
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from "react-redux";
import DashboardCommentCard from "./dashboard-comment-card";
import TutorDashboardMeetingCard from "./tutor-dashboard-meeting-card";

export default function TutorDashboard({ data }) {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  const { id } = useParams();
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === "Tutor") {
      setStudent(currentUser);
      setLoading(false);
    };
  }, []);

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
        {loading ?
          <CircularProgress />
          : (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant={isNonMobileScreens ? "h2" : "h3"}>{student?.name}'s Dashboard</Typography>
                  <Typography variant="subtitle1">Track your students and stay on top of your sessions</Typography>
                </Box>
                <Typography variant="subtitle2">Last Login: 3/7/2025 22:00</Typography>
              </Box>

              <Box
                gridColumn="span 2"
                display="grid"
                gridTemplateColumns={isNonMobileScreens ? "2fr 1fr" : "minmax(0, 700px)"}
                gridAutoRows="minmax(350px, auto)"
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
                  <Box>
                    <Box display="flex" justifyContent="start" alignItems="center" gap="2px">
                      <CalendarMonthIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
                      <Typography variant={isSmallestScreens ? "h6" : "h4"}>Today Scheduled (3 Meetings)</Typography>
                    </Box>
                    <Box>
                      <TutorDashboardMeetingCard
                        studentName="Student Name 1"
                        studentEmail="studentname1@edx.ac.uk"
                        type="Offline"
                        datetime="9/3/2025 10:30"
                      />
                      <TutorDashboardMeetingCard
                        studentName="Student Name 2"
                        studentEmail="studentname2@edx.ac.uk"
                        type="Online"
                        datetime="9/3/2025 10:30"
                      />
                      <TutorDashboardMeetingCard
                        studentName="Student Name 3"
                        studentEmail="studentname3@edx.ac.uk"
                        type="Online"
                        datetime="9/3/2025 10:30"
                      />
                    </Box>
                  </Box>
                </Box>
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
                  <Box
                    mt="20px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="7px"
                  >
                    <Typography>80% of students attended this month.</Typography>
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
                display="grid"
                gridTemplateColumns={isNonMobileScreens ? "repeat(2,minmax(550px, 700px))" : "minmax(0, 700px)"}
                gridAutoRows="minmax(350px, auto)"
                justifyContent="center"
                gap="20px"
              >

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
