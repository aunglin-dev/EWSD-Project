import { Avatar, Box, Typography } from "@mui/material";

export default function MeetingCard({ topicName, date, time, addition }) {
    return (
        <Box width="fit-content" border="1px solid black" borderRadius="13px" padding="10px" paddingRight="20px" display="flex" justifyContent="start" alignItems="end" gap="20px">
            <Avatar variant="square" src="./../assets/sample.jpg" sx={{ borderRadius: "10px", width: "8rem", height: "8rem" }} />
            <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="start" gap="12px">
                <Box>
                    <Typography fontWeight="bold">{topicName}</Typography>
                    <Box display="flex" justifyContent="start" alignItems="end" gap="10px">
                        <Typography fontSize="14px">{date}</Typography>
                        <Typography>|</Typography>
                        <Typography fontSize="12px">{time}</Typography>
                    </Box>
                </Box>
                <Box display="flex" alignItems="end" justifyContent="start" gap="4px">
                    <Avatar src="./../assets/sample.jpg" sx={{ width: "30px", height: "30px" }} />
                    <Box overflow="hidden">
                        <Typography fontSize="9px" fontWeight="bold">Tutor</Typography>
                        <Typography fontSize="12px">Tutor Name</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}