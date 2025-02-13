import React from "react";
import { Typography } from "@mui/material";
import AllocateForm from "./allocate-form";
import AllocateTable from "./allocate-table";

export default function AllocatePage() {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Allocate Students to Tutor
      </Typography>
      <AllocateForm />
      <AllocateTable />
    </div>
  );
}
