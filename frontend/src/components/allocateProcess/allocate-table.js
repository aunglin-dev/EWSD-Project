import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function AllocateTable({ tutors, allocationResponse }) {
  console.log("tutors from allocate page =>", tutors);
  console.log("allocation data=>", allocationResponse);
  //const [filteredData, setFilteredData] = useState(allocatedStudents);

  const handleEdit = (id) => {
    console.log("Edit student with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete student with id:", id);
  };

  return (
    // <div>
    //   <TableContainer sx={{ maxHeight: 400 }}>
    //     <Table sx={{ minWidth: 650 }} aria-label="student allocation table">
    //       <TableHead>
    //         <TableRow>
    //           <TableCell>ID</TableCell>
    //           <TableCell>Tutor</TableCell>
    //           <TableCell>Student Count</TableCell>
    //           <TableCell>Students</TableCell>
    //           <TableCell>Actions</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {filteredData.map((row) => {
    //           // Safely accessing tutor and student data
    //           const tutorName = row.tutor?.name || "N/A"; // Default to 'N/A' if tutor is undefined
    //           const studentNames = row.student
    //             ? row.student.map((student) => student.name).join(", ")
    //             : "No Students"; // Default if no students allocated

    //           return (
    //             <TableRow key={row._id}>
    //               <TableCell>{row._id}</TableCell>
    //               <TableCell>{tutorName}</TableCell>
    //               <TableCell>{row.student?.length || 0}</TableCell>
    //               <TableCell>{studentNames}</TableCell>
    //               <TableCell>
    //                 <Button
    //                   onClick={() => handleEdit(row._id)}
    //                   variant="outlined"
    //                   color="primary"
    //                   sx={{ mr: 1 }}
    //                 >
    //                   Edit
    //                 </Button>
    //                 <Button
    //                   onClick={() => handleDelete(row._id)}
    //                   variant="outlined"
    //                   color="secondary"
    //                 >
    //                   Delete
    //                 </Button>
    //               </TableCell>
    //             </TableRow>
    //           );
    //         })}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </div>
    <>hello</>
  );
}
