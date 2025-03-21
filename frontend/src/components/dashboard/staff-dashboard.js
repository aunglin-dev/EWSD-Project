import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import PushPinIcon from "@mui/icons-material/PushPin";
import AddIcon from "@mui/icons-material/Add";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import axiosInstance from "../../services/AxiosInstance.js";
import dayjs from "dayjs";

export default function StaffDashboard() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1156px)");
  const isSmallestScreens = useMediaQuery("(max-width: 426px)");
  const { currentUser } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [allocatedTutorStudents, setAllocatedTutorStudents] = useState([]);
  const [alreadyAllocatedStudents, setAlreadyAllocatedStudents] = useState([]);
  const [mostActiveUser, setMostActiveUer] = useState([]);
  const [mostUsedPlatform, setMostUsedPlatform] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [mostViewPage, setMostViewPage] = useState([]);
  const [mostUsedBrowser, setMostUsedBrowser] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const mostActiveUserResponse = await axiosInstance.get(
          "http://localhost:8000/api/activities/mostActiveUser"
        );
        const mostViewPageResponse = await axiosInstance.get(
          "http://localhost:8000/api/activities/mostViewPage"
        );
        const mostUsedBrowserResponse = await axiosInstance.get(
          "http://localhost:8000/api/activities/mostUsedBrowser"
        );
        const mostUsedPlatformResponse = await axiosInstance.get(
          "http://localhost:8000/api/meetings/mostUsedPlatform"
        );

        setMostUsedBrowser(mostUsedBrowserResponse.data);
        setMostViewPage(mostViewPageResponse.data);
        setInactiveStudents(
          studentResponse.data.filter(
            (student) => student.lastLoginDate === null
          )
        );
        setMostUsedPlatform(mostUsedPlatformResponse.data);
        setMostActiveUer(mostActiveUserResponse.data);
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

        setAlreadyAllocatedStudents(response.data.map((v) => v.student._id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setLoading(false);
  }, []);

  // if (currentUser?.role != "Staff") return <NoAthnicationCase />;

  return (
    <Box paddingY="100px" paddingX={isNonMobileScreens ? "20px" : "10px"}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="start"
          gap="30px"
        >
          <Box
            display="flex"
            flexDirection={isSmallestScreens && "column"}
            justifyContent="space-between"
            alignItems={isSmallestScreens ? "start" : "center"}
            gap="18px"
          >
            <Box>
              <Typography variant={isNonMobileScreens ? "h2" : "h3"}>
                Welcome, {currentUser?.name}!
              </Typography>
              <Typography variant="subtitle1">
                Manage Allocations and Monitor System Activity
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              Last Login:{" "}
              {currentUser?.lastLoginDate ? dayjs(currentUser?.lastLoginDate).format("DD/MM/YYYY, hh:mm A") : "Never"}
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
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems={isSmallestScreens ? "center" : "start"}
                  gap="5px"
                >
                  <PeopleAltIcon
                    sx={{
                      width: isSmallestScreens ? "18px" : "20px",
                      height: isSmallestScreens ? "18px" : "20px",
                    }}
                  />
                  <Typography
                    variant={isSmallestScreens ? "caption" : "subtitle2"}
                    fontWeight="400"
                  >
                    Total Tutors
                  </Typography>
                </Box>
                <Typography
                  variant={isSmallestScreens ? "h5" : "h4"}
                  color="primary.main"
                >
                  {tutors.length} Tutors
                </Typography>
                <Box display="flex" justifyContent="end">
                  <IconButton href="/tutors">
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
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems={isSmallestScreens ? "center" : "start"}
                  gap="5px"
                >
                  <SchoolIcon
                    sx={{
                      width: isSmallestScreens ? "18px" : "20px",
                      height: isSmallestScreens ? "18px" : "20px",
                    }}
                  />
                  <Typography
                    variant={isSmallestScreens ? "caption" : "subtitle2"}
                    fontWeight="400"
                  >
                    Total Students
                  </Typography>
                </Box>
                <Typography
                  variant={isSmallestScreens ? "h5" : "h4"}
                  color="primary.main"
                >
                  {students.length} Students
                </Typography>
                <Box display="flex" justifyContent="end">
                  <IconButton href="/students">
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={isSmallestScreens ? "center" : "start"}
                  gap="5px"
                >
                  <Typography
                    variant={isSmallestScreens ? "h5" : "h4"}
                    color="#E10022"
                  >
                    {
                      allocatedTutorStudents.filter(
                        (tutor) => tutor.allocations.length == "0"
                      ).length
                    }{" "}
                    Tutors
                  </Typography>
                  <ErrorIcon
                    sx={{
                      width: isSmallestScreens ? "18px" : "20px",
                      height: isSmallestScreens ? "18px" : "20px",
                    }}
                  />
                </Box>
                <Typography
                  mt="20px"
                  variant={isSmallestScreens ? "caption" : "subtitle2"}
                  fontWeight="400"
                >
                  Need student allocations
                </Typography>
                <Box display="flex" justifyContent="end">
                  <IconButton href="/allocate">
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={isSmallestScreens ? "center" : "start"}
                  gap="5px"
                >
                  <Typography
                    variant={isSmallestScreens ? "h5" : "h4"}
                    color="#E10022"
                  >
                    {students.length - alreadyAllocatedStudents.length} Students
                  </Typography>
                  <ErrorIcon
                    sx={{
                      width: isSmallestScreens ? "18px" : "20px",
                      height: isSmallestScreens ? "18px" : "20px",
                    }}
                  />
                </Box>
                <Typography
                  mt="20px"
                  variant={isSmallestScreens ? "caption" : "subtitle2"}
                  fontWeight="400"
                >
                  Need tutor allocations
                </Typography>
                <Box display="flex" justifyContent="end">
                  <IconButton href="/allocate">
                    <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Unallocated Teacher */}
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
                <PushPinIcon
                  sx={{
                    width: isSmallestScreens ? "14px" : "24px",
                    height: isSmallestScreens ? "14px" : "24px",
                  }}
                />
                <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                  Unallocated Tutors
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap="25px" mt="40px">
                {allocatedTutorStudents.filter(
                  (allocatedTutor) => allocatedTutor.allocations.length < 1
                ).length > 0 ? (
                  allocatedTutorStudents
                    .filter(
                      (allocatedTutor) => allocatedTutor.allocations.length < 1
                    )
                    ?.map((allocation, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                        borderRadius="3px"
                        gap="10px"
                      >
                        <Box
                          display="flex"
                          flexDirection={isNonMobileScreens ? "row" : "column"}
                          justifyContent="space-between"
                          alignContent="center"
                          flex="2"
                        >
                          <Box>
                            <Typography
                              fontSize={isSmallestScreens && "16px"}
                              fontWeight="500"
                            >
                              {allocation.tutor.name}
                            </Typography>
                            <Typography
                              fontSize={isSmallestScreens ? "13px" : "14px"}
                            >
                              {allocation.tutor.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box flex="1" display="flex" justifyContent="end">
                          <Button
                            variant="outlined"
                            sx={{
                              backgroundColor: "#fff",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              fontSize: isSmallestScreens && "16px",
                            }}
                            href={`/allocateReallocate/${allocation.tutor._id}`}
                            startIcon={
                              <AddIcon sx={{ width: "24px", height: "24px" }} />
                            }
                          >
                            Allocate
                          </Button>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <Typography>No unallocated tutor.</Typography>
                )}
              </Box>
            </Box>

            {/* Second Row */}
            {/* Most Active User */}
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Box>
                <Typography variant={isNonMobileScreens ? "h4" : "h5"}>
                  Most Active Users
                </Typography>
                <Typography variant="subtitle1" fontSize="14px">
                  Most active users of the platform
                </Typography>
              </Box>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      mostActiveUser[0]?.user.name,
                      mostActiveUser[1]?.user.name,
                      mostActiveUser[2]?.user.name,
                      mostActiveUser[3]?.user.name,
                      mostActiveUser[4]?.user.name,
                    ],
                  },
                ]}
                yAxis={[{ scaleType: "linear" }]}
                series={[
                  {
                    data: [
                      mostActiveUser[0]?.count,
                      mostActiveUser[1]?.count,
                      mostActiveUser[2]?.count,
                      mostActiveUser[3]?.count,
                      mostActiveUser[4]?.count,
                    ],
                    color: "#0A1F44",
                  },
                ]}
                width={isNonMobileScreens ? 500 : isSmallestScreens ? 300 : 420}
                height={400}
              />
            </Box>

            {/* Unallocated students */}
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              maxHeight="500px"
              overflow="auto"
            >
              <Box
                display="flex"
                flexDirection={isSmallestScreens && "column"}
                justifyContent="space-between"
                gap="25px"
              >
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  gap="5px"
                >
                  <PushPinIcon
                    sx={{
                      width: isSmallestScreens ? "14px" : "24px",
                      height: isSmallestScreens ? "14px" : "24px",
                    }}
                  />
                  <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                    Unallocated Students
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      fontSize: isSmallestScreens && "16px",
                    }}
                    href="/allocate"
                    startIcon={
                      <AddIcon sx={{ width: "24px", height: "24px" }} />
                    }
                  >
                    Allocate
                  </Button>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="25px" mt="40px">
                {students.filter(
                  (student) => !alreadyAllocatedStudents.includes(student._id)
                ).length > 0 ? (
                  students
                    .filter(
                      (student) =>
                        !alreadyAllocatedStudents.includes(student._id)
                    )
                    ?.map((student, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                        borderRadius="3px"
                        gap="10px"
                      >
                        <Box
                          display="flex"
                          flexDirection={isNonMobileScreens ? "row" : "column"}
                          justifyContent="space-between"
                          alignContent="center"
                          flex="2"
                        >
                          <Box>
                            <Typography
                              fontSize={isSmallestScreens && "16px"}
                              fontWeight="500"
                            >
                              {student.name}
                            </Typography>
                            <Typography
                              fontSize={isSmallestScreens ? "13px" : "14px"}
                            >
                              {student.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <Typography>No unallocated student.</Typography>
                )}
              </Box>
            </Box>

            {/* Third Row */}
            {/* Most used meeting platform */}
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
                <Typography variant={isNonMobileScreens ? "h4" : "h5"}>
                  Most Used Meeting Platform
                </Typography>
                <Typography variant="subtitle1" fontSize="14px">
                  Most used platforms for tutor/student meetings
                </Typography>
              </Box>
              <PieChart
                series={[
                  {
                    data: mostUsedPlatform?.map((platform) => ({
                      value: platform.count,
                      label: platform.platform,
                    })),
                  },
                ]}
                width={isSmallestScreens ? 300 : 600}
                height={200}
                slotProps={{
                  legend: {
                    labelStyle: { fontSize: 12 },
                    itemMarkWidth: 14,
                    itemMarkHeight: 14,
                    hidden: isSmallestScreens && true,
                  },
                }}
              />
            </Box>

            {/* Inactive students */}
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              overflow="auto"
              maxHeight="500px"
            >
              <Box
                display="flex"
                flexDirection={isSmallestScreens && "column"}
                justifyContent="space-between"
                gap="15px"
              >
                <Box
                  display="flex"
                  justifyContent="start"
                  alignItems="center"
                  gap="5px"
                >
                  <DoDisturbAltIcon
                    sx={{
                      width: isSmallestScreens ? "14px" : "24px",
                      height: isSmallestScreens ? "14px" : "24px",
                    }}
                  />
                  <Typography variant={isSmallestScreens ? "h6" : "h4"}>
                    Inactive Students
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="25px" mt="40px">
                {inactiveStudents.length ? (
                  inactiveStudents.map((student, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      borderRadius="3px"
                      gap="10px"
                    >
                      <Box
                        display="flex"
                        flexDirection={isNonMobileScreens ? "row" : "column"}
                        justifyContent="space-between"
                        alignContent="center"
                        flex="2"
                      >
                        <Box>
                          <Typography
                            fontSize={isSmallestScreens && "16px"}
                            fontWeight="500"
                          >
                            {student.name}
                          </Typography>
                          <Typography
                            fontSize={isSmallestScreens ? "13px" : "14px"}
                          >
                            {student.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography>No unallocated student.</Typography>
                )}
              </Box>
            </Box>

            {/* Fourth Row */}
            {/* Most view page */}
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Box>
                <Typography variant={isNonMobileScreens ? "h4" : "h5"}>
                  Most View Pages
                </Typography>
                <Typography variant="subtitle1" fontSize="14px">
                  Most view pages of the platform
                </Typography>
              </Box>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      mostViewPage[0]?.page,
                      mostViewPage[1]?.page,
                      mostViewPage[2]?.page,
                      mostViewPage[3]?.page,
                      mostViewPage[4]?.page,
                    ],
                  },
                ]}
                yAxis={[
                  {
                    scaleType: "linear",
                  },
                ]}
                series={[
                  {
                    data: [
                      mostViewPage[0]?.count,
                      mostViewPage[1]?.count,
                      mostViewPage[2]?.count,
                      mostViewPage[3]?.count,
                      mostViewPage[4]?.count,
                    ],
                    color: "#0A1F44",
                  },
                ]}
                width={isNonMobileScreens ? 500 : isSmallestScreens ? 300 : 420}
                height={400}
              />
            </Box>
            {/* Most used browser */}
            <Box
              paddingY="15px"
              paddingX={isSmallestScreens ? "15px" : "25px"}
              borderRadius="10px"
              bgcolor="#fff"
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              justifyContent="start"
              alignItems="start"
              gap="20px"
            >
              <Box width="100%">
                <Typography variant={isNonMobileScreens ? "h4" : "h5"}>
                  Most Used Browsers
                </Typography>
                <Typography variant="subtitle1" fontSize="14px">
                  Most commonly used browsers to access the system
                </Typography>
              </Box>
              <Box
                width="100%"
                height="100%"
                overflow="hidden"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <PieChart
                  series={[
                    {
                      data: mostUsedBrowser?.map(
                        (browser) =>
                          browser.browser && {
                            value: browser.count,
                            label: browser.browser,
                          }
                      ),
                    },
                  ]}
                  width={isSmallestScreens ? 300 : 600}
                  height={200}
                  slotProps={{
                    legend: {
                      labelStyle: { fontSize: 12 },
                      itemMarkWidth: 14,
                      itemMarkHeight: 14,
                      hidden: isSmallestScreens && true,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
