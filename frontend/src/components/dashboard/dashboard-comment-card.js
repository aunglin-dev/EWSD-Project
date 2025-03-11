import { Box, Divider, Typography, Button, useMediaQuery } from "@mui/material"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const DashboardCommentCard = ({ title, createdDateTime, description, commentCount, ownerName }) => {
    const isSmallestScreens = useMediaQuery("(max-width: 426px)");

    return (

        <Box display="flex" flexDirection="column" justifyContent="space-between" gap="10px" bgcolor="#F4F5F7" padding="8px">
            <Box display="flex" justifyContent="space-between" alignItems="end">
                <Typography flex="2" variant={isSmallestScreens ? "h6" : "h5"} fontWeight="500" noWrap>{title}</Typography>
                <Typography flex="1" variant="caption" fontSize={isSmallestScreens && "10px"} textAlign="end">{createdDateTime}</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight="400">{description}</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="end" borderTop="1px solid #93909080" paddingTop="10px">
                <Typography fontSize={isSmallestScreens ? "13px" : "15px"} fontWeight="600" flex="1">Posted By {ownerName}</Typography>
                <Button variant="text" sx={{ fontSize: isSmallestScreens ? "13px" : "15px", "&:hover": { bgcolor: "inherit" }, fontWeight: "600", padding: "0" }} endIcon={<ArrowCircleRightIcon />}>View Details</Button>
            </Box>
        </Box>

    )
}
export default DashboardCommentCard