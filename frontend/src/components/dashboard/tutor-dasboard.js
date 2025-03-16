import { useParams } from "react-router";
import { useEffect, useState } from "react";
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SchoolIcon from '@mui/icons-material/School';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PushPinIcon from '@mui/icons-material/PushPin';
import VerifiedIcon from '@mui/icons-material/Verified'; import { PieChart } from '@mui/x-charts/PieChart';
import { useSelector } from "react-redux";
import DashboardCommentCard from "./dashboard-comment-card";
import TutorDashboardMeetingCard from "./tutor-dashboard-meeting-card";
import axiosInstance from "../../services/AxiosInstance";

export default function TutorDashboard() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1070px)");
  const { currentUser } = useSelector((state) => state.auth);
  const { id } = useParams();
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === "Tutor") {
      setTutor(currentUser);
      setLoading(false);
    };

    if (id) {
      const fetchData = async () => {
        try {
          const tutorResponse = await axiosInstance.get(
            `http://localhost:8000/api/tutors/${id}`
          );

          const allocationsResponse = await axiosInstance.get(
            "http://localhost:8000/api/allocations"
          );

          const tutor = {
            allocations: allocationsResponse.data?.filter(
              (allocation) => allocation.tutor._id === id && allocation
            ),
            ...tutorResponse.data
          };
          setTutor(tutor);
          console.log(tutor);

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
      {currentUser?.role !== "Tutor" &&
        <Button href="/tutors" type="button" variant="text" sx={{ padding: 0, fontSize: "16px" }} startIcon={<KeyboardBackspaceIcon sx={{ width: "18px", height: "18px" }} />}>
          Back
        </Button>
      }
      <Box
        mt={currentUser?.role !== "Tutor" && "40px"}
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        {loading ?
          <CircularProgress />
          : (
            <>
              <Box display="flex" flexDirection={isSmallestScreens && "column"} justifyContent="space-between" alignItems={isSmallestScreens ? "start" : "center"} gap="18px">
                <Box>
                  <Typography variant={isNonMobileScreens ? "h2" : "h3"}>{tutor?.name}'s Dashboard</Typography>
                  {currentUser?.role !== "Tutor" ?
                    <Typography variant="subtitle1">Access tutor activity overview</Typography>
                    :
                    <Typography variant="subtitle1">Track your tutors and stay on top of your sessions</Typography>
                  }
                </Box>
                <Typography variant="subtitle2">Last Login: 3/7/2025 22:00</Typography>
              </Box>

              {/* First Row */}
              <Box
                display="grid"
                gridTemplateColumns={isNonMobileScreens ? "1fr 1fr 1fr 1fr" : isSmallestScreens ? "1fr" : "1fr 1fr"}
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
                >
                  <Box display="flex" justifyContent="start" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                    <SchoolIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Total Assigned Students</Typography>
                  </Box>
                  <Typography mt="20px" variant={isSmallestScreens ? "h5" : "h4"} color="primary.main">{tutor.allocations.length} Students</Typography>
                </Box>

                <Box
                  paddingY="15px"
                  paddingX={isSmallestScreens ? "15px" : "25px"}
                  borderRadius="10px"
                  bgcolor="#fff"
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                >
                  <Box display="flex" justifyContent="start" alignItems={isSmallestScreens ? "center" : "start"} gap="5px">
                    <InsertInvitationIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Upcoming Meetings</Typography>
                  </Box>
                  <Typography mt="20px" variant={isSmallestScreens ? "h5" : "h4"} color="primary.main">4 Meetings</Typography>
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
                    <Typography variant={isSmallestScreens ? "h5" : "h4"} color="#E10022">2 Meeting Requests</Typography>
                    <PendingActionsIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                  </Box>
                  <Typography mt="20px" variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Awaiting tutor approval</Typography>
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
                    <Typography variant={isSmallestScreens ? "h5" : "h4"} color="primary.main">10 Meetings</Typography>
                    <VerifiedIcon sx={{ width: isSmallestScreens ? "18px" : "20px", height: isSmallestScreens ? "18px" : "20px" }} />
                  </Box>
                  <Typography mt="20px" variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">Completed this month</Typography>
                  <Box display="flex" justifyContent="end">
                    <IconButton>
                      <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </Box>
                </Box>

              </Box>

              {/* Second Row */}
              <Box
                display="grid"
                gridTemplateColumns={isNonMobileScreens ? "2fr 1fr" : "minmax(0, 700px)"}
                gridAutoRows="minmax(350px, auto)"
                justifyContent="center"
                gap="20px"
              >
                {/* Meeting Card */}
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
                    <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                      <CalendarMonthIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
                      <Typography variant={isSmallestScreens ? "h6" : "h4"}>Today Scheduled (3 Meetings)</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="space-between" gap="30px" mt="40px">
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

              {/* Third Row */}
              <Box
                display="grid"
                gridTemplateColumns={isNonMobileScreens ? "repeat(2,minmax(450px, 700px))" : "minmax(0, 700px)"}
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

              {/* Forth Row */}
              {tutor.allocations.length > 0 &&
                <Box
                  paddingY="15px"
                  paddingX={isSmallestScreens ? "15px" : "25px"}
                  borderRadius="10px"
                  bgcolor="#fff"
                  boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                >
                  <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                    <PushPinIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
                    {currentUser !== "Tutor" ?
                      <Typography variant={isSmallestScreens ? "h6" : "h4"}>Student List</Typography>
                      :
                      <Typography variant={isSmallestScreens ? "h6" : "h4"}>My Student List</Typography>
                    }
                  </Box>
                  <Box display="flex" justifyContent="start" alignItems="center" gap="15px" mt="40px">
                    <Button variant="contained" sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }}>All</Button>
                    <Button variant="outlined" sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }}>Most Active</Button>
                    <Button variant="outlined" sx={{ fontSize: isSmallestScreens ? "12px" : "16px" }}>Least Active</Button>
                  </Box>
                  <TableContainer sx={{ mt: "20px", bgcolor: "#fff" }}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableBody>
                        {tutor.allocations.map(allocation =>
                          <TableRow key={allocation._id} borderBottom="0">
                            <TableCell>
                              <Typography variant={isSmallestScreens ? "subtitle2" : "h5"} fontWeight="500">{allocation.student.name}</Typography>
                              <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">{allocation.student.email}</Typography>
                            </TableCell>
                            <TableCell sx={{ minWidth: "180px" }}>
                              <Typography variant={isSmallestScreens ? "subtitle2" : "h5"} fontWeight="500">Total Meetings</Typography>
                              <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">2</Typography>
                            </TableCell>
                            <TableCell sx={{ minWidth: "200px" }}>
                              <Typography variant={isSmallestScreens ? "subtitle2" : "h5"} fontWeight="500">Last Interaction Date</Typography>
                              <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="400">9/3/2025</Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "end", minWidth: "200px" }}>
                              <Button href={`/student-dashboard/${allocation.student._id}`} variant="outlined" sx={{ fontSize: "14px" }}>
                                View Dashboard
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            </>
          )}
      </Box>
    </Box >
  );
}
