import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function StaffDashboard({ data }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: 3, border: "1px solid #ccc" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Teacher Name</TableCell>
            <TableCell>Teacher Email</TableCell>
            <TableCell>Students</TableCell>
            <TableCell>Total Students</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>students </TableCell>
              <TableCell>10</TableCell>
              <TableCell>{new Date(row.created_date).getFullYear()}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Button variant="contained" sx={{ textTransform: "none" }}>
                    Edit
                  </Button>
                  <DeleteIcon sx={{ color: "red" }} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
