import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery
} from "@mui/material";
import { useSelector } from "react-redux";

export default function TutorDashboard({ data }) {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <Typography variant="h5">Hello {currentUser?.name}</Typography>
      <h1>{currentUser?.role} dashboard</h1>
      {/* <TableContainer
        component={Paper}
        sx={{ marginTop: 3, border: "1px solid #ccc" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                Student Email
              </TableCell>
              <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                Department
              </TableCell>
              <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                Year
              </TableCell>
              <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                  {row.name}
                </TableCell>
                <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                  {row.email}
                </TableCell>
                <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                  {row.department}
                </TableCell>
                <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                  {new Date(row.created_date).getFullYear()}
                </TableCell>
                <TableCell sx={{ borderRight: 1, borderColor: "#cfcdca" }}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
}
