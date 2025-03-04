import { Box, Button, Typography, useMediaQuery } from "@mui/material"
import { Link } from "react-router-dom"

const CompletedCard = ({
    title,
    type,
    datetime,
    platform,
    location,
    meetingLink,
    remark,
    done
}) => {
    const isSmallestScreens = useMediaQuery("(max-width: 425px)");

    return (
        <Box
            minWidth="300px"
            height="376px"
            border="1px solid #939090"
            backgroundColor="#fff"
            borderRadius="10px"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap="5px"
                padding={isSmallestScreens ? "10px" : "18px 22px"}
                borderBottom="1px solid #939090"
            >
                <Typography variant={isSmallestScreens ? "subtitle2" : "h4"} fontWeight="600" textTransform="capitalize" noWrap>{title}</Typography>
                {type === "online" ?
                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} paddingX="18px" borderRadius="20px" backgroundColor="#00c80040">{type}</Typography>
                    : type === "offline" &&
                    <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} paddingX="18px" borderRadius="20px" backgroundColor="#0000c840">{type}</Typography>
                }
            </Box>
            <Box
                paddingX={isSmallestScreens ? "10px" : "22px"}
                height="230px"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                justifyContent="start"
                gap="20px"
            >
                <Box>
                    <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Date & Time</Typography>
                    <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">{datetime}</Typography>
                </Box>
                <Box>
                    {location.length > 0 && (
                        <Box>
                            <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Location</Typography>
                            <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">{location}</Typography>
                        </Box>
                    )}
                    {platform.length > 0 && (
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Platform</Typography>
                                <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight="400">{platform}</Typography>
                            </Box>
                            <Box>
                                <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Meeting Link</Typography>
                                <Link to={meetingLink} style={{ display: "block", color: "inherit", fontSize: "14px" }}> Click to open link</Link>
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box>
                    <Typography variant={isSmallestScreens ? "h6" : "subtitle2"} fontWeight="600">Remark</Typography>
                    <Typography variant={isSmallestScreens ? "caption" : "h6"} fontWeight={400}>{remark}</Typography>
                </Box>
            </Box>
            <Box
                padding={isSmallestScreens ? "10px" : "5px 22px 18px"}
                display="flex"
                justifyContent={!done ? "space-between" : "end"}
                alignItems="center"
            >
                <Typography variant={isSmallestScreens ? "caption" : "subtitle2"} fontWeight="600" color="#E10022">{!done && "Missed Session"}</Typography>
                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: "#fff",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        fontSize: isSmallestScreens && "16px",
                    }}
                >Remove</Button>
            </Box>
        </Box >
    )
}
export default CompletedCard