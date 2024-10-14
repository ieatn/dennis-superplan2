import React from "react";
import { TypeIcon } from "./TypeIcon";
import { Box, Typography, Paper } from "@mui/material";

export const CustomDragPreview = ({ monitorProps }) => {
  const item = monitorProps.item;

  return (
    // background preview blue box
    <Paper
      // elevation={3}
      sx={{
        p: 1,
        // maxWidth: 300,
        // alignItems: "center",
        backgroundColor: "#1967d2",
        borderRadius: "4px",
        boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)",
        color: "#fff",
        // makes smaller
        display: "inline-grid",
        fontSize: "14px",
        // gap: "8px",
        // gridTemplateColumns: "auto auto",
        // padding: "4px 8px",
        // pointerEvents: "none",
      }}
    >
      {/* center icon and text inside preview */}
      <Box display="flex" alignItems="center">
        <Box>
          {/* show folder or file icon */}
          <TypeIcon droppable={item.droppable || false} />
        </Box>
        <Box>
          {/* shows text */}
          <Typography variant="body1" component="div" fontWeight="bold">
            {item.text}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
