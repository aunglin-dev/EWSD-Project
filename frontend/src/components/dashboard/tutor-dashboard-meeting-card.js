import { Box, IconButton, Typography } from "@mui/material"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


const TutorDashboardMeetingCard = (
    { studentName, studentEmail, type, datetime }
) => {
    return (
        <Box>
            <Box>
                <Typography>{studentName}</Typography>
                <Typography>{studentEmail}</Typography>
            </Box>
            <Box>
                <Typography>Online/Offline</Typography>
                <Typography>{type}</Typography>
            </Box>
            <Box>
                <Typography>Date & Time</Typography>
                <Typography>{datetime}</Typography>
            </Box>
            <IconButton>
                <ArrowCircleRightIcon />
            </IconButton>
        </Box>
    )
}
export default TutorDashboardMeetingCard