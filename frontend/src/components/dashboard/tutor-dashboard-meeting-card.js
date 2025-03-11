import { Box, IconButton, Typography, useMediaQuery } from "@mui/material"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


const TutorDashboardMeetingCard = (
    { studentName, studentEmail, type, datetime }
) => {
    const isSmallestScreens = useMediaQuery("(max-width: 573px)");
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");


    return (
        <Box display="flex" justifyContent="space-between" alignItems={isSmallestScreens ? "start" : "center"} gap="15px">
            <Box flex="15" display="flex" flexDirection={isSmallestScreens && "column"} justifyContent="start" gap="15px">
                <Box flex="1">
                    <Typography variant={!isNonMobileScreens ? "subtitle2" : "h5"} fontWeight="600">{studentName}</Typography>
                    <Typography variant={!isNonMobileScreens ? "caption" : "subtitle2"} sx={{ textDecoration: "underline", fontWeight: "400" }} noWrap>{studentEmail}</Typography>
                </Box>
                <Box flex="1">
                    <Typography variant={!isNonMobileScreens ? "subtitle2" : "h5"} fontWeight="600">Online/Offline</Typography>
                    <Typography variant={!isNonMobileScreens ? "caption" : "subtitle2"} fontWeight="400">{type}</Typography>
                </Box>
                <Box flex="1">
                    <Typography variant={!isNonMobileScreens ? "subtitle2" : "h5"} fontWeight="600">Date & Time</Typography>
                    <Typography variant={!isNonMobileScreens ? "caption" : "subtitle2"} fontWeight="400" noWrap>{datetime}</Typography>
                </Box>
            </Box>
            <Box flex="1" display="flex" justifyContent="end" width={isSmallestScreens && "100%"}>
                <IconButton>
                    <ArrowCircleRightIcon sx={{ color: "primary.main" }} />
                </IconButton>
            </Box>
        </Box >
    )
}
export default TutorDashboardMeetingCard