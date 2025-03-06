import { Box, Divider, Typography, Button, useMediaQuery } from "@mui/material"
import RateReviewIcon from '@mui/icons-material/RateReview';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const DashboardBlogCard = ({ title, createdDateTime, description, commentCount, ownerName }) => {
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
            <Box display="flex" justifyContent="start" alignItems="center" gap="5px">
                <RateReviewIcon sx={{ width: isSmallestScreens ? "16px" : "24px", height: isSmallestScreens ? "16px" : "24px" }} />
                <Typography variant={isSmallestScreens ? "h6" : "h4"}>Latest Blog Post</Typography>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" gap="20px">
                <Box display="flex" justifyContent="space-between" alignItems="end">
                    <Typography flex="2" variant={isSmallestScreens ? "h6" : "h5"} fontWeight="500" noWrap>{title}</Typography>
                    <Typography flex="1" variant="caption" fontSize={isSmallestScreens && "10px"} textAlign="end">{createdDateTime}</Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="400">{description}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="end" borderTop="1px solid #93909080" paddingTop="10px">
                    <Typography fontSize={isSmallestScreens ? "13px" : "15px"} fontWeight="600" flex="1">{commentCount} comments</Typography>
                    <Typography fontSize={isSmallestScreens ? "13px" : "15px"} fontWeight="600" flex="2" textAlign="end">Posted By {ownerName}</Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="end">
                <Button variant="text" sx={{ fontSize: isSmallestScreens ? "14px" : "16px", "&:hover": { bgcolor: "inherit" } }} endIcon={<ArrowCircleRightIcon />}>View all</Button>
            </Box>
        </Box>
    )
}
export default DashboardBlogCard