import { data, useParams } from "react-router";
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
  CircularProgress,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import StudentDashboardMeetingCard from "./student-dashboard-meeting-card";
import DashboardCommentCard from "./dashboard-comment-card";
import axiosInstance from "../../services/AxiosInstance.js";
import dayjs from "dayjs";
import axios from "axios";

export default function StudentDashboard() {
  const { id } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width: 1140px)");
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [student, setStudent] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [upComingMeeting, setUpComingMeeting] = useState(null);
  const [lastMissedMeeting, setlastMissedMeeting] = useState(null);
  const [lastCompetedMeeting, setlastCompetedMeeting] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [meetingPercentage, setMeetingPercentage] = useState({});
  const [documentComments, setDocumentComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetingPercentage = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/student/${id}/totalMeetingsOfStudent `
      );

      if (res.status == 200) {
        console.log("meeting percentage_____________", res.data);
        setMeetingPercentage(res.data);
        console.log("meeting percentage_____________", meetingPercentage);
      } else {
        setMeetingPercentage(res.data);
        console.log("erorrrrr", meetingPercentage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAndSetDate = (dateTime, setStateFunction) => {
    if (!dateTime) {
      setStateFunction(null); // Set state to null if dateTime is undefined or null
      return;
    }

    const date = new Date(dateTime);
    const formattedDate = `${date.getUTCDate()}/${
      date.getUTCMonth() + 1
    }/${date.getUTCFullYear()} ${date.getUTCHours()}:${date
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")}`;

    setStateFunction(formattedDate); // Update the state with the formatted date
  };

  const fetchUpcomingMetting = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/student/${id}/fetchoneUpcommingMeetingForStudent`
      );

      if (res.status == 200) {
        console.log("Upcoming meeting _____________", res.data);

        //Upcoming Date
        // const upcomingdate = new Date(
        //   res.data?.latestUpcomingMeeting?.dateTime
        // );

        // const formattedDateupcomingdate = `${upcomingdate.getUTCDate()}/${
        //   upcomingdate.getUTCMonth() + 1
        // }/${upcomingdate.getUTCFullYear()} ${upcomingdate.getUTCHours()}:${upcomingdate
        //   .getUTCMinutes()
        //   .toString()
        //   .padStart(2, "0")}`;

        // setUpComingMeeting(formattedDateupcomingdate);

        formatAndSetDate(
          res.data.latestUpcomingMeeting?.dateTime,
          setUpComingMeeting
        );

        // Format and set last missed meeting date
        formatAndSetDate(
          res.data.lastMissedMeeting?.dateTime,
          setlastMissedMeeting
        );

        // Format and set last completed meeting date
        formatAndSetDate(
          res.data.lastCompetedMeeting?.dateTime,
          setlastCompetedMeeting
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (currentUser && currentUser.role === "Student") {
      setStudent(currentUser);
    }

    if (id) {
      const fetchData = async () => {
        try {
          const studentResponse = await axiosInstance.get(
            `http://localhost:8000/api/students/${id}`
          );

          const allocationsResponse = await axiosInstance.get(
            "http://localhost:8000/api/allocations"
          );

          const student = {
            allocations: allocationsResponse.data?.filter(
              (allocation) => allocation.student._id === id && allocation
            ),
            ...studentResponse.data,
          };
          setStudent(student);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      fetchMeetingPercentage(id);
      fetchUpcomingMetting(id);
    }

    const fetchDocumentComments = async (role, id) => {
      try {
        const documentCommentResponse = await axiosInstance.get(
          `http://localhost:8000/api/documentcomments/last2/${role}/${id}`
        );

        setDocumentComments(documentCommentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDocumentComments("student", id ? id : currentUser._id);

    const fetchDocuments = async (role, id) => {
      try {
        const documentResponse = await axiosInstance.get(
          `http://localhost:8000/api/documents/allocation/${role}/${id}/last-five`
        );
        setDocuments(documentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDocuments("student", id ? id : currentUser._id);

    const fetchMeeting = async (id) => {
      try {
        const meetingResponse = await axiosInstance.get(
          `http://localhost:8000/api/meetings/student/confirmed/lastmeeting/${id}`
        );
        setMeeting(meetingResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchMeeting(id ? id : currentUser._id);

    setLoading(false);
  }, [upComingMeeting]);

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = url.split("/").pop();
    link.click();
  };

  return (
    <Box paddingY="100px" paddingX={isNonMobileScreens ? "20px" : "10px"}>
      {currentUser?.role !== "Student" && (
        <Button
          href={currentUser?.role === "Staff" ? "/students" : `/tutor-dashboard/${currentUser?._id}`}
          type="button"
          variant="text"
          sx={{ padding: 0, fontSize: "16px" }}
          startIcon={
            <KeyboardBackspaceIcon sx={{ width: "18px", height: "18px" }} />
          }
        >
          Back
        </Button>
      )}
      <Box
        mt={currentUser?.role !== "Student" && "40px"}
        display="flex"
        flexDirection="column"
        justifyContent="start"
        gap="30px"
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Box
              display="flex"
              flexDirection={isSmallestScreens && "column"}
              justifyContent="space-between"
              alignItems={isSmallestScreens ? "start" : "center"}
              gap="18px"
            >
              <Box>
                <Typography variant={isNonMobileScreens ? "h2" : "h3"}>
                  {student?.name}'s Dashboard
                </Typography>
                {currentUser?.role !== "Student" ? (
                  <Typography variant="subtitle1">
                    Access student activity overview
                  </Typography>
                ) : (
                  <Typography variant="subtitle1">
                    Stay on track with your meetings and progress.
                  </Typography>
                )}
              </Box>
              <Typography variant="subtitle2">
                Last Login:{" "}
                {student?.lastLoginDate ? dayjs(student?.lastLoginDate).format("DD/MM/YYYY, hh:mm A") : "Never"}
              </Typography>
            </Box>
            <Box
              display="grid"
              gridTemplateColumns={
                isNonMobileScreens
                  ? "repeat(2,minmax(550px, 700px))"
                  : "minmax(0, 700px)"
              }
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
                justifyContent="start"
                gap="45px"
              >
                {meeting?.length ?
                  <StudentDashboardMeetingCard
                    title={meeting[0].title}
                    type={meeting[0].type}
                    tutorName={meeting[0].tutor.name}
                    datetime={dayjs(meeting[0].dateTime).format("DD/MM/YYYY, hh:mm A")}
                    platform={meeting[0].meetingPlatform}
                    location={meeting[0].meetingLocation}
                    meetingLink={meeting[0].meetingLink}
                    role={currentUser?.role}
                  />
                  :
                  <Typography>No upcoming meeting.</Typography>
                }
              </Box>

              {/* Attendance Card */}
              <Box
                paddingY="15px"
                paddingX={isSmallestScreens ? "15px" : "25px"}
                borderRadius="10px"
                bgcolor="#fff"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              >
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  gap="5px"
                >
                  <PermContactCalendarIcon
                    sx={{
                      width: isSmallestScreens ? "16px" : "24px",
                      height: isSmallestScreens ? "16px" : "24px",
                    }}
                  />
                  <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                    Attendance Summary
                  </Typography>
                </Box>
                {Object.keys(meetingPercentage).length > 0 ? (
                  <Box
                    display="flex"
                    flexDirection={isSmallestScreens ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center"
                    gap="7px"
                  >
                    <Box
                      flex="2"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      paddingTop="50px"
                      gap="40px"
                    >
                      <Typography>
                        {Math.round(meetingPercentage?.completed * 10) / 10} %
                        attendance in the last one month.
                      </Typography>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="start"
                        gap="20px"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          justifyItems="start"
                          gap="6px"
                        >
                          <Box>
                            <Typography
                              variant={isSmallestScreens ? "h6" : "subtitle2"}
                              fontWeight="600"
                            >
                              Last Attended
                            </Typography>
                            <Typography
                              variant={isSmallestScreens ? "caption" : "h6"}
                              fontWeight="400"
                            >
                              {lastCompetedMeeting == null
                                ? "None"
                                : lastCompetedMeeting}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant={isSmallestScreens ? "h6" : "subtitle2"}
                              fontWeight="600"
                            >
                              Upcoming Session
                            </Typography>
                            <Typography
                              variant={isSmallestScreens ? "caption" : "h6"}
                              fontWeight="400"
                            >
                              {upComingMeeting == null
                                ? "None"
                                : upComingMeeting}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography
                            variant={isSmallestScreens ? "h6" : "subtitle2"}
                            fontWeight="600"
                            color="#E10022"
                          >
                            Last Missed Session
                          </Typography>
                          <Typography
                            variant={isSmallestScreens ? "caption" : "h6"}
                            fontWeight="400"
                          >
                            {lastMissedMeeting == null
                              ? "None"
                              : lastMissedMeeting}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box flex="1">
                      <PieChart
                        sx={{
                          "& .MuiPieArc-root": { transform: "translateX(20%)" },
                        }}
                        series={[
                          {
                            data: [
                              {
                                id: 0,
                                value: meetingPercentage?.pending,
                                label: "Pending",
                                color: "#FFFF00",
                              },
                              {
                                id: 1,
                                value: meetingPercentage?.confirmed,
                                label: "Confirm",
                                color: "#0000FF",
                              },
                              {
                                id: 2,
                                value: meetingPercentage?.cancelled,
                                label: "Cancel",
                                color: "#FFA500",
                              },
                              {
                                id: 3,
                                value: meetingPercentage?.missed,
                                label: "missed",
                                color: "#FF0000",
                              },
                              {
                                id: 4,
                                value: meetingPercentage?.completed,
                                label: "completed",
                                color: "#00FF00",
                              },
                            ],
                          },
                        ]}
                        width={250}
                        height={250}
                        slotProps={{
                          legend: {
                            direction: "row",
                            position: {
                              vertical: "bottom",
                              horizontal: "middle",
                            },
                            labelStyle: { fontSize: 10 },
                            itemMarkWidth: 12,
                            itemMarkHeight: 12,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection={isSmallestScreens ? "column" : "row"}
                    justifyContent="center" // Center horizontally
                    alignItems="center" // Center vertically
                    gap="7px"
                    height="100%" // Ensure the Box takes full height (if needed)
                  >
                    <Typography
                      variant="h2"
                      textAlign="center"
                      color="textSecondary"
                    >
                      No meeting data available.
                    </Typography>
                  </Box>
                )}
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
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  gap="5px"
                >
                  <DescriptionIcon
                    sx={{
                      width: isSmallestScreens ? "16px" : "24px",
                      height: isSmallestScreens ? "16px" : "24px",
                    }}
                  />
                  <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                    Recent Shared Document
                  </Typography>
                </Box>
                {documents.length ? (
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow sx={{ borderBottom: "1px solid #93909080" }}>
                          <TableCell
                            sx={{
                              paddingBottom: "5px",
                              paddingTop: "15px",
                              fontSize: isSmallestScreens ? "14px" : "18px",
                              fontWeight: "500",
                              minWidth: "150px",
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingBottom: "5px",
                              paddingTop: "15px",
                              fontSize: isSmallestScreens ? "14px" : "18px",
                              fontWeight: "500",
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingBottom: "5px",
                              paddingTop: "15px",
                              fontSize: isSmallestScreens ? "14px" : "18px",
                              fontWeight: "500",
                              minWidth: "150px",
                            }}
                          >
                            Uploaded By
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingBottom: "5px",
                              paddingTop: "15px",
                              fontSize: isSmallestScreens ? "14px" : "18px",
                              fontWeight: "500",
                            }}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.map((document) => (
                          <TableRow
                            key={document._id}
                            sx={{ borderBottom: "1px solid #93909080" }}
                          >
                            <TableCell
                              sx={{
                                paddingBottom: "5px",
                                paddingTop: "15px",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              {document.description}
                            </TableCell>
                            <TableCell
                              sx={{
                                paddingBottom: "5px",
                                paddingTop: "15px",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              {new Date(
                                document.createdAt
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell
                              sx={{
                                paddingBottom: "5px",
                                paddingTop: "15px",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              {document.documentOwner.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                paddingBottom: "5px",
                                paddingTop: "15px",
                                fontSize: "14px",
                                fontWeight: "400",
                              }}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(document.url);
                                }}
                              >
                                <DownloadIcon
                                  sx={{
                                    color: "#000",
                                    width: "24px",
                                    height: "24px",
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="h5">No uploaded document.</Typography>
                )}
                {currentUser?.role === "Student" && (
                  <Box display="flex" justifyContent="end">
                    <Button
                      href="/student/document"
                      variant="text"
                      sx={{
                        fontSize: isSmallestScreens ? "14px" : "16px",
                        "&:hover": { bgcolor: "inherit" },
                      }}
                      endIcon={<ArrowCircleRightIcon />}
                    >
                      View all
                    </Button>
                  </Box>
                )}
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
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  gap="5px"
                >
                  <RateReviewIcon
                    sx={{
                      width: isSmallestScreens ? "16px" : "24px",
                      height: isSmallestScreens ? "16px" : "24px",
                    }}
                  />
                  <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                    Recent Comments
                  </Typography>
                </Box>
                {documentComments.length ? (
                  documentComments.map((documentComments) => (
                    <DashboardCommentCard
                      key={documentComments._id}
                      title={documentComments.document.description}
                      createdDateTime={dayjs(document.createdAt).format(
                        "DD/MM/YYYY, hh:mm A"
                      )}
                      description={documentComments.comment}
                      ownerName={documentComments.commentOwner.name}
                      role={currentUser?.role}
                    />
                  ))
                ) : (
                  <Typography variant="h5">No uploaded document.</Typography>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
