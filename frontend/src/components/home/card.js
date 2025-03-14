import { Box, Typography, useTheme, Avatar } from "@mui/material";

export default function Card({ title, subtitle, addition, imgSrc, tutorName }) {
  return (
    <Box
      borderRadius="9px"
      width="10rem"
      height="100%"
      border="1px solid black"
      paddingBottom="5px"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="5px"
        alignItems="start"
      >
        <Avatar
          variant="square"
          sx={{
            borderRadius: "8px 8px 0 0",
            width: "10rem",
            height: "10rem",
          }}
          src={imgSrc}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          gap="10px"
        >
          <Box paddingX="9px">
            <Typography fontSize="16px">{title}</Typography>
            <Typography fontSize="12px">{subtitle}</Typography>
          </Box>
          <Box
            width="10rem"
            paddingX="9px"
            boxSizing="border-box"
            display="flex"
            alignItems="end"
            justifyContent="start"
            gap="4px"
          >
            <Avatar
              src="./assets/sample.jpg"
              sx={{ width: "28px", height: "28px" }}
            />
            <Box overflow="hidden">
              <Typography fontSize="9px" fontWeight="bold">
                Tutor
              </Typography>
              <Typography fontSize="12px">{tutorName}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
