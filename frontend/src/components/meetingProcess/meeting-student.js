import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                >
                    Request Meeting
                </Button>
            </Box>

            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
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
                <CustomTabPanel value={value} index={0}>
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
                <CustomTabPanel value={value} index={1}>
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
                <CustomTabPanel value={value} index={2}>
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
                            done={false}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="online"
                            datetime="11/3/2025 15:00"
                            platform="Google Meet"
                            location=""
                            meetingLink="some link"
                            remark="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, unde. Hic, ea."
                            done={false}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            platform=""
                            location="Campus 3"
                            meetingLink="some link"
                            remark="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti minima reprehenderit repellendus alias?"
                            done={true}
                        />
                        <CompletedCard
                            title="Meeting title"
                            type="offline"
                            datetime="11/3/2025 15:00"
                            platform=""
                            location="Campus 3"
                            meetingLink="some link"
                            remark="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti minima reprehenderit repellendus alias?"
                            done={true}
                        />
                    </Box>
                </CustomTabPanel>
            </Box >
        </Box >
    );
}
