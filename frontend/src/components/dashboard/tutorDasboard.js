import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function TutorDashboard({ data }) {
  return (
    <TableContainer
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
    </TableContainer>
  );
}
