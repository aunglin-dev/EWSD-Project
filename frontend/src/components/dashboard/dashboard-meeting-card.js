import { Box, Divider, Typography, Button, useMediaQuery } from "@mui/material"
import PushPinIcon from '@mui/icons-material/PushPin';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Link } from "react-router-dom";

const DashboardMeetingCard = ({ title, type, tutorName, datetime, platform, meetingLink, location }) => {
    const isSmallestScreens = useMediaQuery("(max-width: 426px)");
    return (
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="start" alignItems="center" gap="2px">
                    <PushPinIcon sx={{ width: isSmallestScreens ? "14px" : "24px", height: isSmallestScreens ? "14px" : "24px" }} />
                    <Typography variant={isSmallestScreens ? "h6" : "h4"}>Upcoming Tutoring Meeting</Typography>
                </Box>
                {type === "online" ?
                    <Typography variant="subtitle2" fontSize={isSmallestScreens && "11px"} paddingX="8px" borderRadius="20px" backgroundColor="#00c80040">{type}</Typography>
                    : type === "offline" &&
                    <Typography variant="subtitle2" fontSize={isSmallestScreens && "11px"} paddingX="8px" borderRadius="20px" backgroundColor="#0000c840">{type}</Typography>
                }
            </Box>
            <Typography variant={isSmallestScreens ? "h6" : "h5"} fontWeight="400">Next tutoring session with <span style={{ fontWeight: "600" }}>{tutorName}</span> is at <span style={{ fontWeight: "600" }}>{datetime}</span>.</Typography>
            <Box display="flex" flexDirection="column" justifyContent="space-between" gap="10px">
                <Typography fontSize={isSmallestScreens ? "15px" : "17px"} fontWeight="500">Meeting Details</Typography>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="start" gap="5px">
                    <Box>
                        <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="inline-block" fontWeight="600">Date & Time</Typography>
                        <Typography variant="h6" fontSize={isSmallestScreens && "11px"} fontWeight="400">{datetime}</Typography>
                    </Box>
                    <>
                        {location.length > 0 && (
                            <Box>
                                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="600">Location</Typography>
                                <Typography variant="h6" fontSize={isSmallestScreens && "11px"} fontWeight="400">{location}</Typography>
                            </Box>
                        )}
                        {platform.length > 0 && (
                            <>
                                <Box>
                                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="inline-block" fontWeight="600">Platform</Typography>
                                    <Typography variant="h6" fontSize={isSmallestScreens && "11px"} fontWeight="400">{platform}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} display="inline-block" fontWeight="600">Meeting Link</Typography>
                                    <Link to={meetingLink} style={{ display: "block", color: "inherit", fontSize: isSmallestScreens ? "11px" : "14px" }}>Click to open link</Link>
                                </Box>
                            </>
                        )}
                    </>
                </Box>
            </Box>
            <Box display="flex" justifyContent="end">
                <Button variant="text" sx={{ fontSize: isSmallestScreens ? "14px" : "16px", "&:hover": { bgcolor: "inherit" } }} endIcon={<ArrowCircleRightIcon />}>View all</Button>
            </Box>
        </Box>
    )
}
export default DashboardMeetingCard