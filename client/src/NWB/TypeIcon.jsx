import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

export const TypeIcon = (props) => {
  if (props.droppable) {
    return <FolderIcon />;
  }

  return <DescriptionIcon />;
};
