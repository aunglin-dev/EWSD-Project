import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  useMediaQuery
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Axios from "axios";

export default function StaffDashboard() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:8000/api/allocations"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDeleteAllocation = async (allocationId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this allocation ${allocationId}?`
    );

    if (isConfirmed) {
      try {
        const response = await Axios.delete(
          `http://localhost:8000/api/allocations/${allocationId}`
        );
        if (response.status === 200) {
          setData((prevData) =>
            prevData.filter((allocation) => allocation._id !== allocationId)
          );
          console.log("Allocation deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting allocation:", error);
      }
    } else {
      console.log("Deletion canceled");
    }
  };

  if (!data || data.length === 0) {
    return <h1>Staff dashboard has no data</h1>;
  }

  return (
    <Box
      paddingY="100px"
      paddingX={isNonMobileScreens ? "20px" : "10px"}
    >
      <h1>Staff ddashboard</h1>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 3,
          border: "1px solid #black",
          padding: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                Teacher Name
              </TableCell>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                Total Students
              </TableCell>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>Year</TableCell>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>Status</TableCell>
              <TableCell sx={{ border: "1px solid #d1cbcb" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((allocation) => (
              <TableRow key={allocation._id}>
                <TableCell sx={{ borderLeft: "1px solid #d1cbcb" }}>
                  {allocation.tutor.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                  {allocation.student.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                  {allocation.student.length}
                </TableCell>
                <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                  {new Date(allocation.createdAt).getFullYear()}
                </TableCell>
                <TableCell sx={{ border: "1px solid #d1cbcb" }}>
                  {allocation.status}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #d1cbcb" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Button variant="contained" sx={{ textTransform: "none" }}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteAllocation(allocation?._id)}
                    >
                      <DeleteIcon sx={{ color: "red", cursor: "pointer" }} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
