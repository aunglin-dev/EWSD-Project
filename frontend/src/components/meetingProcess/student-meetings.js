import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/AxiosInstance";
import ScheduledCard from "./scheduled-card";
import RequestedCard from "./requested-card";
import CompletedCard from "./completed-card";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Modal,
  IconButton,
  FormControl,
  FormLabel,
  OutlinedInput,
  Select,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import NoAthnicationCase from "../error/NoAuthenicationcase";

function CustomTabPanel({ children, value, index }) {
  return value === index && <Box>{children}</Box>;
}

export default function StudentMeetings() {
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const { studentId } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [studentName, setStudentName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const { currentUser } = useSelector((state) => state.auth);

  const getAllocationId = () => {
    if (currentUser != null) {
      const allocation = currentUser.allocations.find(
        (alloc) => alloc.student === studentId
      );
      return allocation?._id || null;
    }
  };

  const allocationId = getAllocationId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = await fetchStudentDetails(studentId);
        if (student) {
          setStudentName(student.name);
        } else {
          setStudentName("invalid student");
        }
        if (!allocationId) {
          throw new Error("no allocation found");
        }
        // console.log("allo id=>", allocationId);
        const response = await axiosInstance.get(
          `http://localhost:8000/api/meetings/allocation/${allocationId}`
        );
        setMeetings(response.data);
      } catch (error) {
        console.error("fail fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId, allocationId]);

  const scheduledMeetings = meetings.filter((m) => m.status === 1);
  const requestedMeetings = meetings.filter(
    (m) => m.status === 0 || m.status === 2
  );
  const completedMeetings = meetings.filter((m) => m.status === 4);

  const handleChange = (event, newTab) => {
    setTab(newTab);
  };
  const handleDeclineMeeting = (declinedMeetingId) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((m) =>
        m._id === declinedMeetingId ? { ...m, status: 2 } : m
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        role: currentUser.role,
        allocationId: allocationId,
        dateTime: data.date,
        type: data.type,
        title: data.title,
        remark: data.remark,
        meetingLink: data.type === "online" ? data.meetingLink : "",
        meetingLocation: data.type === "offline" ? data.meetingLocation : "",
        meetingPlatform: data.type === "online" ? data.meetingPlatform : "",
        status: 0,
      };

      const response = await axiosInstance.post(
        "http://localhost:8000/api/meetings",
        payload
      );

      console.log("meet data=>", response.data);
      alert("Meeting created successfully!");
      handleClose();
    } catch (error) {
      console.error("fail creating meeting", error);
      alert("Failed to create meeting.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (currentUser?.role != "Tutor") return <NoAthnicationCase />;
  return (
    <Box paddingY="80px" paddingX="20px">
      <Box marginBottom="40px" display="flex" justifyContent="space-between">
        <Typography variant="h2">Meetings for {studentName}</Typography>
        {currentUser?.role === "Tutor" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Request Meeting
          </Button>
        )}
      </Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Scheduled" />
        <Tab label="Requested" />
        <Tab label="Completed" />
      </Tabs>
      {/* scheduled meeting */}
      <CustomTabPanel value={tab} index={0}>
        <Box
          display="grid"
          gridTemplateColumns={
            isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"
          }
          gridAutoFlow="dense"
          justifyContent="center"
          columnGap="15px"
          rowGap="30px"
          mt="30px"
        >
          {scheduledMeetings.length > 0 ? (
            scheduledMeetings.map((meeting) => (
              <ScheduledCard
                key={meeting._id}
                meetingId={meeting._id}
                title={meeting.title}
                type={meeting.type === "virtual" ? "online" : "offline"}
                datetime={new Date(meeting.dateTime).toLocaleString()}
                platform={meeting.meetingPlatform || ""}
                location={meeting.meetingLocation || ""}
                meetingLink={meeting.meetingLink || ""}
                remark={meeting.remark || ""}
                role={
                  meeting.requesterId === currentUser._id ? "You" : "Student"
                }
                onDecline={handleDeclineMeeting}
              />
            ))
          ) : (
            <Typography>No scheduled meetings found.</Typography>
          )}
        </Box>
      </CustomTabPanel>
      {/* requested meeting */}
      <CustomTabPanel value={tab} index={1}>
        <Box
          display="grid"
          gridTemplateColumns={
            isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"
          }
          gridAutoFlow="dense"
          justifyContent="center"
          columnGap="15px"
          rowGap="30px"
          mt="30px"
        >
          {requestedMeetings.length > 0 ? (
            requestedMeetings.map((meeting) => (
              <RequestedCard
                key={meeting._id}
                meetingId={meeting._id}
                title={meeting.title}
                type={meeting.type === "virtual" ? "online" : "offline"}
                datetime={new Date(meeting.dateTime).toLocaleString()}
                remark={meeting.remark || ""}
                declined={meeting.status === 2}
                location={meeting.meetingLocation || ""}
                meetingLink={meeting.meetingLink || ""}
                requesterId={meeting.requesterId}
                currentUserId={currentUser._id}
                onCancel={(canceledMeetingId) =>
                  setMeetings((prevMeetings) =>
                    prevMeetings.map((m) =>
                      m._id === canceledMeetingId ? { ...m, status: 2 } : m
                    )
                  )
                }
                onConfirm={(confirmedMeetingId) =>
                  setMeetings((prevMeetings) =>
                    prevMeetings.map((m) =>
                      m._id === confirmedMeetingId ? { ...m, status: 1 } : m
                    )
                  )
                }
              />
            ))
          ) : (
            <Typography>No requested meetings found.</Typography>
          )}
        </Box>
      </CustomTabPanel>

      {/* completed meetings */}
      <CustomTabPanel value={tab} index={2}>
        <Box
          display="grid"
          gridTemplateColumns={
            isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"
          }
          gridAutoFlow="dense"
          justifyContent="center"
          columnGap="15px"
          rowGap="30px"
          mt="30px"
        >
          {completedMeetings.length > 0 ? (
            completedMeetings.map((meeting) => (
              <CompletedCard
                key={meeting._id}
                title={meeting.title}
                type={meeting.type === "virtual" ? "online" : "offline"}
                datetime={new Date(meeting.dateTime).toLocaleString()}
                platform={meeting.meetingPlatform || ""}
                location={meeting.meetingLocation || ""}
                meetingLink={meeting.meetingLink || ""}
                remark={meeting.remark || ""}
                met={meeting.met || false}
              />
            ))
          ) : (
            <Typography>No completed meetings found.</Typography>
          )}
        </Box>
      </CustomTabPanel>

      {/* modal meet start  here */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            bgcolor: "#fff",
            borderRadius: "10px",
            p: "40px",
          }}
        >
          <Box display="flex" justifyContent="end">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h4" gutterBottom>
            Request a Meeting
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <FormLabel>Select Date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  onChange={(date) =>
                    setValue("date", date ? date.toISOString() : null)
                  }
                  renderInput={(props) => <OutlinedInput {...props} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Online/Offline</FormLabel>
              <Select {...register("type")} defaultValue="online" fullWidth>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Title</FormLabel>
              <OutlinedInput
                {...register("title")}
                placeholder="Enter meeting title"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Remark</FormLabel>
              <OutlinedInput
                {...register("remark")}
                placeholder="Enter remark"
                fullWidth
                multiline
                rows={2}
              />
            </FormControl>
            {watch("type") === "online" && (
              <FormControl fullWidth>
                <FormLabel>Meeting Link</FormLabel>
                <OutlinedInput
                  {...register("meetingLink")}
                  placeholder="Enter meeting link"
                  fullWidth
                />
              </FormControl>
            )}
            {watch("type") === "offline" && (
              <FormControl fullWidth>
                <FormLabel>Meeting Location</FormLabel>
                <OutlinedInput
                  {...register("meetingLocation")}
                  placeholder="Enter meeting location"
                  fullWidth
                />
              </FormControl>
            )}
            <Box display="flex" justifyContent="end" marginTop="20px">
              <Button type="submit" variant="contained" color="primary">
                Submit Request
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

const fetchStudentDetails = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `http://localhost:8000/api/students/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error(`fail data feth student ${studentId}:`, error);
    return null;
  }
};
