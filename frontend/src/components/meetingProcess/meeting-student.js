import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useForm } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import CompletedCard from "./completed-card";
import RequestedCard from "./requested-card";
import ScheduledCard from "./scheduled-card";
import axiosInstance from "../../services/AxiosInstance";
import { useSelector } from "react-redux";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MeetingStudent() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1025px)");
  const isSmallestScreens = useMediaQuery("(max-width: 425px)");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { currentUser } = useSelector((state) => state.auth);
  //console.log("user=>", currentUser);
  const { register, handleSubmit, setValue, watch } = useForm();
  const [tab, setTab] = useState(0);
  const meetingType = watch("type");
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };
  const fetchMeetings = async () => {
    try {
      const allocationId = currentUser.allocations[0]?._id;
      const response = await axiosInstance.get(
        `http://localhost:8000/api/meetings/allocation/${allocationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meetings:", error);
      return [];
    }
  };

  const [meetings, setMeetings] = useState([]);
  useEffect(() => {
    const getMeetings = async () => {
      const data = await fetchMeetings();
      setMeetings(data);
    };
    getMeetings();
  }, []);
  const scheduledMeetings = meetings.filter((m) => m.status === 1);
  const requestedMeetings = meetings.filter(
    (m) => m.status === 0 || m.status === 2
  );
  const completedMeetings = meetings.filter((m) => m.status === 4);
  const onSubmit = async (data) => {
    try {
      const payload = {
        role: "Student",
        allocationId: currentUser.allocations[0]?._id,
        dateTime: data.date,
        type: data.type,
        title: data.title,
        remark: data.remark,
        meetingLink: data.type === "online" ? data.meetingLink : "",
        meetingLocation: data.type === "offline" ? data.meetingLocation : "",
        status: 0,
      };
      console.log("payload=>", payload);
      await axiosInstance.post("http://localhost:8000/api/meetings", payload);
      alert("created meeting successfully!");
      handleClose();
      const updatedMeetings = await fetchMeetings();
      setMeetings(updatedMeetings);
    } catch (error) {
      console.error("error creating meeting", error);
      alert("failed to create meeting.");
    }
  };

  return (
    <Box paddingY="100px" paddingX={isNonMobileScreens ? "20px" : "10px"}>
      <Box
        display="flex"
        flexDirection={isNonMobileScreens ? "row" : "column"}
        width="100%"
        justifyContent="space-between"
        alignItems={isNonMobileScreens ? "center" : "start"}
        gap="20px"
        marginBottom="40px"
      >
        <Box>
          <Typography variant={isNonMobileScreens ? "h2" : "h3"}>
            Meetings
          </Typography>
          <Typography variant="subtitle1">
            View your scheduled meetings and requested meetings
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{ width: "24px", height: "24px" }} />}
          onClick={handleOpen}
        >
          Request Meeting
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ overflow: "auto" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isNonMobileScreens
                ? "700px"
                : isSmallestScreens
                ? "310px"
                : "410px",
              borderRadius: "10px",
              bgcolor: "#fff",
              p: "40px 30px",
            }}
          >
            <Box display="flex" justifyContent="end" marginBottom="20px">
              <IconButton onClick={handleClose} sx={{ padding: 0 }}>
                <CloseIcon sx={{ color: "#000" }} />
              </IconButton>
            </Box>
            <Box marginBottom="40px">
              <Typography variant={isNonMobileScreens ? "h2" : "h3"}>
                Request a Meeting
              </Typography>
              <Typography variant="subtitle1">
                Choose a date for your meeting request with personal tutor
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth>
                <FormLabel
                  sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                >
                  Select Date
                </FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    onChange={(date) =>
                      setValue("date", date ? date.toISOString() : null)
                    }
                    sx={{
                      "& .MuiInputBase-root": { fontSize: "16px" },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel
                  sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                >
                  Online/Offline
                </FormLabel>
                <Select
                  {...register("type")}
                  defaultValue="online"
                  fullWidth
                  sx={{ fontSize: "16px", fontWeight: "400" }}
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel
                  sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                >
                  Title
                </FormLabel>
                <OutlinedInput
                  {...register("title")}
                  placeholder="Enter your meeting title"
                  autoComplete="off"
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel
                  sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                >
                  Remark
                </FormLabel>
                <OutlinedInput
                  {...register("remark")}
                  placeholder="Enter your remark"
                  autoComplete="off"
                  fullWidth
                  multiline
                  rows={2}
                />
              </FormControl>
              {meetingType === "online" && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <FormLabel
                    sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                  >
                    Meeting Link
                  </FormLabel>
                  <OutlinedInput
                    {...register("meetingLink")}
                    placeholder="Enter meeting link"
                    fullWidth
                  />
                </FormControl>
              )}
              {meetingType === "offline" && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <FormLabel
                    sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}
                  >
                    Meeting Location
                  </FormLabel>
                  <OutlinedInput
                    {...register("meetingLocation")}
                    placeholder="Enter meeting location"
                    fullWidth
                  />
                </FormControl>
              )}
              <Box display="flex" justifyContent="end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4 }}
                >
                  Submit Request
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{
              fontSize: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "14px"
                : "16px",
              padding: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "10px"
                : "15px",
            }}
            label="Scheduled"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              fontSize: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "14px"
                : "16px",
              padding: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "10px"
                : "15px",
            }}
            label="Requested"
            {...a11yProps(1)}
          />
          <Tab
            sx={{
              fontSize: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "14px"
                : "16px",
              padding: isNonMobileScreens
                ? "18px"
                : isSmallestScreens
                ? "10px"
                : "15px",
            }}
            label="Completed"
            {...a11yProps(2)}
          />
        </Tabs>

        {/* scheduled meet */}
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
                  role={meeting.role}
                  onDecline={(declinedMeetingId) =>
                    setMeetings((prevMeetings) =>
                      prevMeetings.map((m) =>
                        m._id === declinedMeetingId ? { ...m, status: 2 } : m
                      )
                    )
                  }
                />
              ))
            ) : (
              <Typography>No scheduled meetings found.</Typography>
            )}
          </Box>
        </CustomTabPanel>

        {/* requested meets */}
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
                  type={meeting.type}
                  datetime={new Date(meeting.dateTime).toLocaleString()}
                  remark={meeting.remark || ""}
                  declined={meeting.status === 2}
                  location={meeting.meetingLocation || ""}
                  meetingLink={meeting.meetingLink || ""}
                  role={meeting.role}
                  requesterId={meeting.requesterId}
                  currentUserRole={currentUser.role}
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
              <Typography>No meetings foud.</Typography>
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
                  met={meeting.status === 4}
                />
              ))
            ) : (
              <Typography>No completed meetings fond.</Typography>
            )}
          </Box>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
