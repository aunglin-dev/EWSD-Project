import React, { useState } from "react";
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
    TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useForm } from "react-hook-form";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import CompletedCard from "./completed-card";
import RequestedCard from "./requested-card";
import ScheduledCard from "./scheduled-card";

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
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MeetingStudent() {
    const isNonMobileScreens = useMediaQuery("(min-width: 1025px)");
    const isSmallestScreens = useMediaQuery("(max-width: 425px)");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { register, handleSubmit, setValue } = useForm();
    const [tab, setTab] = useState(0);

    const handleChange = (event, newTab) => {
        setTab(newTab);
    };

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <Box
            paddingY="100px"
            paddingX={isNonMobileScreens ? "20px" : "10px"}
        >
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
                    <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Meetings</Typography>
                    <Typography variant="subtitle1">View your scheduled meetings and  requested  meetings </Typography>
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
                    <Box sx={{
                        position: "absolute",
                        top: "100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: isNonMobileScreens ? "700px" : isSmallestScreens ? "310px" : "410px",
                        borderRadius: "10px",
                        bgcolor: "#fff",
                        p: "40px 30px",
                    }}>
                        <Box display="flex" justifyContent="end" marginBottom="20px">
                            <IconButton
                                onClick={handleClose}
                                sx={{ padding: 0 }}
                            >
                                <CloseIcon sx={{ color: "#000" }} />
                            </IconButton>
                        </Box>
                        <Box marginBottom="40px">
                            <Typography variant={isNonMobileScreens ? "h2" : "h3"}>Request a Meeting</Typography>
                            <Typography variant="subtitle1">Choose a date for your meeting request with personal tutor</Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth>
                                <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>Select Date</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        onChange={(date) => setValue("date", date ? date.toISOString() : null)}
                                        sx={{
                                            '& .MuiInputBase-root': { fontSize: "16px" },
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>Online/Offline</FormLabel>
                                <Select
                                    {...register("type")}
                                    defaultValue="online"
                                    fullWidth
                                    sx={{ fontSize: "16px", fontWeight: "400" }}
                                >
                                    <MenuItem sx={{ fontSize: "16px", fontWeight: "400", color: "#000" }} value="online">Online</MenuItem>
                                    <MenuItem sx={{ fontSize: "16px", fontWeight: "400", color: "#000" }} value="offline">Offline</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>Title</FormLabel>
                                <OutlinedInput
                                    {...register("title")}
                                    type="text"
                                    placeholder="Enter your meeting title"
                                    autoComplete="off"
                                    fullWidth
                                    sx={{ fontSize: "16px", fontWeight: "400" }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <FormLabel sx={{ fontSize: "16px", fontWeight: "500", color: "#000" }}>Remark</FormLabel>
                                <OutlinedInput
                                    {...register("remark")}
                                    type="text"
                                    placeholder="Enter your remark"
                                    autoComplete="off"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ fontSize: "16px", fontWeight: "400" }}
                                />
                            </FormControl>

                            <Box display="flex" justifyContent="end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 4,
                                    }}
                                >
                                    Submit Request
                                </Button>
                            </Box>
                        </form>

                    </Box>
                </Modal>
            </Box>

            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                        <Tab sx={{
                            fontSize: isNonMobileScreens ? "18px" : isSmallestScreens ? "14px" : "16px",
                            padding: isNonMobileScreens ? "18px" : isSmallestScreens ? "10px" : "15px"
                        }} label="Scheduled" {...a11yProps(0)} />
                        <Tab sx={{
                            fontSize: isNonMobileScreens ? "18px" : isSmallestScreens ? "14px" : "16px",
                            padding: isNonMobileScreens ? "18px" : isSmallestScreens ? "10px" : "15px"
                        }} label="Requested" {...a11yProps(1)} />
                        <Tab sx={{
                            fontSize: isNonMobileScreens ? "18px" : isSmallestScreens ? "14px" : "16px",
                            padding: isNonMobileScreens ? "18px" : isSmallestScreens ? "10px" : "15px"
                        }} label="Completed" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                {/* 
                    - requested && (platform || location) : approved requested meetings
                    - !requested && (platform || location) : tutor added meetings
                */}
                <CustomTabPanel value={tab} index={0}>
                    <Box
                        display="grid"
                        gridTemplateColumns={isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"}
                        gridAutoFlow="dense"
                        justifyContent={isNonMobileScreens ? "start" : "center"}
                        gap="15px"
                        mt="30px"
                    >
                        <ScheduledCard
                            title="Meeting title"
                            type="online"
                            datetime="11/3/2025 15:00"
                            platform="Google Meet"
                            location=""
                            meetingLink="some link"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                        />
                        <ScheduledCard
                            title="Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            platform=""
                            location="Campus 3"
                            meetingLink="some link"
                            remark="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti minima reprehenderit repellendus alias?"
                        />
                    </Box>
                </CustomTabPanel>

                {/* requested && (!platform || !location) : declined requested meetings and not-seen-yet requested meetings */}
                <CustomTabPanel value={tab} index={1}>
                    <Box
                        display="grid"
                        gridTemplateColumns={isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"}
                        gridAutoFlow="dense"
                        justifyContent={isNonMobileScreens ? "start" : "center"}
                        gap="15px"
                        mt="30px"
                    >
                        <RequestedCard
                            title="this is ultra long, longer the super longest title and this is a very long Meeting title"
                            type="online"
                            datetime="11/3/2025 15:00"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                            declined={false}
                        />
                        <RequestedCard
                            title="this is ultra long, longer the super longest title and this is a very long Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                            declined={true}
                        // when tutor has seen the request and approved, it will go to scheduled meeting. 
                        // when the declined is false, it means that tutor hasn't seen or taken action to the request.
                        // in requested tab, only requested (not-seen-yet) meetings and declined meetings are going to be displayed. 
                        />
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={2}>
                    <Box
                        display="grid"
                        gridTemplateColumns={isSmallestScreens ? "none" : "repeat(auto-fill, 380px)"}
                        gridAutoFlow="dense"
                        justifyContent={isNonMobileScreens ? "start" : "center"}
                        gap="15px"
                        mt="30px"
                    >
                        <CompletedCard
                            title="this is ultra long, longer the super longest title and this is a very long Meeting title"
                            type="online"
                            datetime="11/3/2025 15:00"
                            platform="Google Meet"
                            location=""
                            meetingLink="some link"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                            met={false}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="online"
                            datetime="11/3/2025 15:00"
                            platform="Google Meet"
                            location=""
                            meetingLink="some link"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                            met={false}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            platform=""
                            location="Campus 3"
                            meetingLink="some link"
                            remark="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti minima reprehenderit repellendus alias?"
                            met={true}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            platform=""
                            location="Campus 3"
                            meetingLink="some link"
                            remark="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti minima reprehenderit repellendus alias?"
                            met={true}
                        />
                    </Box>
                </CustomTabPanel>
            </Box >
        </Box >
    );
}
