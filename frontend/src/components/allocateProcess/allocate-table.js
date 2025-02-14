import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormLabel,
  Divider,
} from "@mui/material";
import { STUDENT_OBJECTS, TUTOR_OBJECTS } from "../../constants/static_data";

const data = [
  {
    id: 1,
    teacher: "Mike",
    student: "Ryan",
    totalStudents: 13,
    status: "active",
  },
  {
    id: 2,
    teacher: "John",
    student: "Alice",
    totalStudents: 10,
    status: "inactive",
  },
  {
    id: 3,
    teacher: "Jane",
    student: "Bob",
    totalStudents: 15,
    status: "active",
  },
];

export default function AllocateForm() {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
    filterData(event.target.value, selectedDate);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    filterData(selectedTeacher, event.target.value);
  };

  const filterData = (teacher, date) => {
    let newData = data;
    if (teacher) {
      newData = newData.filter((row) => row.teacher.includes(teacher));
    }
    if (date) {
      newData = newData.filter(
        (row) => row.created_date && row.created_date.includes(date)
      );
    }
    setFilteredData(newData);
  };

  const handleEdit = (id) => {
    console.log("Edit student with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete student with id:", id);
  };

  return (
    <div>
      <Box sx={{ my: 3, borderTop: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingTop: "20px",
          }}
        >
          <div style={{ width: "500px" }}>
            <FormControl fullWidth>
              <FormLabel>Filter by Teacher</FormLabel>
              <Select
                value={selectedTeacher}
                onChange={handleTeacherChange}
                sx={{ mb: 2 }}
                size="small"
              >
                <MenuItem value="">
                  <em>All Teachers</em>
                </MenuItem>
                {TUTOR_OBJECTS.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ width: "500px" }}>
            <FormControl fullWidth>
              <FormLabel>Filter by Year</FormLabel>
              <Select
                value={selectedTeacher}
                onChange={handleTeacherChange}
                sx={{ mb: 2 }}
                size="small"
              >
                <MenuItem value="">
                  <em>All Teachers</em>
                </MenuItem>
                {TUTOR_OBJECTS.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {new Date(teacher.created_date).getFullYear()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: "18px" }}
            >
              Search
            </Button>
          </div>
        </div>
      </Box>

      <TableContainer
        sx={{
          maxHeight: 400,
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="student allocation table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Total Students</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.teacher}</TableCell>
                <TableCell>{row.student}</TableCell>
                <TableCell>{row.totalStudents}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(row.id)}
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(row.id)}
                    variant="outlined"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
