import { useParams } from "react-router"
import { STUDENT_OBJECTS } from "../../constants/static_data";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Card from "./card";
import MeetingCard from "./meeting-card";

export default function StudentDashboard() {
    const { id } = useParams();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const student = STUDENT_OBJECTS.filter(student => student.id == id);

    return (
        <Box
            paddingY={isNonMobileScreens ? "100px" : "70px"}
            paddingX={isNonMobileScreens ? "20px" : "10px"}
        >
            <Typography variant={isNonMobileScreens ? "h4" : "h6"} sx={{ marginBottom: "30px" }}>{student[0].name}</Typography>
            <Box marginY="40px">
                <Typography
                    variant="h6"
                    textTransform="uppercase"
                    fontWeight="bold"
                    marginBottom="20px"
                    textAlign={isNonMobileScreens ? "left" : "center"}
                >
                    Latest Documents
                </Typography>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, 10rem)"
                    gridAutoFlow="dense"
                    gap="30px"
                    justifyContent={isNonMobileScreens ? "start" : "center"}
                    alignItems="start"
                >
                    <Card title="Document 1" subtitle="30 MB" addition="" />
                    <Card title="Document 2" subtitle="25 MB" addition="" />
                    <Card title="Document 3" subtitle="32 MB" addition="" />
                </Box>
            </Box>
            <Box marginY="40px">
                <Typography
                    variant="h6"
                    textTransform="uppercase"
                    fontWeight="bold"
                    marginBottom="20px"
                    textAlign={isNonMobileScreens ? "left" : "center"}
                >
                    Latest Blogs
                </Typography>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, 10rem)"
                    gridAutoFlow="dense"
                    gap="30px"
                    justifyContent={isNonMobileScreens ? "start" : "center"}
                    alignItems="start"
                >
                    <Card title="Blog 1" subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit." addition="" />
                    <Card title="Blog 2" subtitle="Lorem ipsum dolor sit amet." addition="" />
                </Box>
            </Box>
            <Box marginY="40px">
                <Typography
                    variant="h6"
                    textTransform="uppercase"
                    fontWeight="bold"
                    marginBottom="20px"
                    textAlign={isNonMobileScreens ? "left" : "center"}

                >
                    Upcoming Meeting
                </Typography>
                <Box display="flex" justifyContent={isNonMobileScreens ? "start" : "center"} alignItems="start">
                    <MeetingCard topicName="MidTerm Presentation" date="30-Feb-2025" time="03:56 PM" addition="" />
                </Box>
            </Box>

        </Box>
    )
}