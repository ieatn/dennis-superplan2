import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { TypeIcon } from "./TypeIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const [folderTotal, setFolderTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(props.node.text);

  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    props.deleteFolder(props.node.id);
  };

  const formatLargeNumber = (number) => {
    if (Math.abs(number) >= 1e6) {
      const formattedNumber = Math.floor((number / 1e6) * 10) / 10; // Round down to 1 decimal place
      return `${formattedNumber}M`;
    } else if (Math.abs(number) >= 1e3) {
      const formattedNumber = Math.floor((number / 1e3) * 10) / 10; // Round down to 1 decimal place
      return `${formattedNumber}K`;
    }
    return number.toLocaleString();
  };

  // this file is just for each individual node
  const rootStyle = {
    // backgroundColor: 'red',
    // display: 'flex',
    // alignItems: 'center',
    // cursor: 'pointer',
  };

  const arrowStyle = {
    // alignItems: 'center',
    // cursor: 'pointer',
    // display: 'flex',
    // justifyContent: 'center',
    // transition: 'transform linear 0.1s',
    // transform: props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
  };

  // center folder and file text, folder 
  const filetypeStyle = {
    display: 'flex',
    // zIndex: 2,
    cursor: 'pointer',
  };

  const labelStyle = {
    // paddingInlineStart: '8px',
  };

  // moves everything in the tree, arrow, folder, files, flex, align items center, padding left, gap
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1rem',
    // outline: '1px solid red',
    gap: '0.5rem',
  };

  // arrow icon
  const toggleIconStyle = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '1.5rem',
    // height: '1.5rem',
    transition: 'transform 0.3s ease',
    transform: props.isOpen ? 'rotate(0deg)' : 'rotate(90deg)',
  };

  const contentStyle = {
    // display: 'flex',
    // flex: 1,
    // marginLeft: '0.5rem',
    // position: 'relative',
  };

  // folder and file text
  const nodeTextStyle = {
    cursor: 'pointer',
  };

  // value text
  const valueStyle = {
    // position: 'absolute',
    // top: 0,
    // left: '300px',
    // fontSize: '1.25rem',
  };

  const valueAssetStyle = {
    ...valueStyle,
    color: '#1f2937',
  };

  const valueLiabilityStyle = {
    ...valueStyle,
    color: '#ef4444',
  };

  useEffect(() => {
    if (droppable) {
      const total = calculateFolderTotal(props.node.id);
      setFolderTotal(total);
    }
  }, [props.treeData, props.node.id, droppable]);

  // also works for multiple nested folders thats really cool power of recursion
  const calculateFolderTotal = (folderId) => {
    return props.treeData.reduce((sum, node) => {
      if (node.parent === folderId) {
        if (node.droppable) {
          // Recursively calculate total for nested folders
          return sum + calculateFolderTotal(node.id);
        } else {
          // For assets and liabilities, use the appropriate property
          return sum + (props.rootId === 400 ? (node.liability || 0) : (node.value || 0));
        }
      }
      return sum;
    }, 0);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewName(props.node.text);
  };

  const handleNameChange = () => {
    props.onNameChange(props.node.id, newName);
    setIsModalOpen(false);
  };

  return (
    <div
      style={{ ...rootStyle, paddingInlineStart: props.depth * 36 }} 
    >
      <div className="node-content" style={containerStyle}>
        {props.node.id !== props.rootId && droppable && (
          <div className="expand-icon" onClick={handleToggle} style={toggleIconStyle}>
            {props.isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </div>
        )}
        <div className="type-icon" style={filetypeStyle}>
          <TypeIcon droppable={droppable} />
        </div>
        <div className="node-text" style={nodeTextStyle} onClick={handleOpenModal}>{props.node.text}</div>
        <IconButton size="small" onClick={handleOpenModal}>
          <EditIcon fontSize="small" />
        </IconButton>
        {droppable && props.node.id !== props.rootId && (
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
        {data && data.value && (
          <div
            className={`value ${data.type}`}
            style={data.type === 'asset' ? valueAssetStyle : valueLiabilityStyle}
          >
            {data.value}
          </div>
        )}
        <span style={{ color: props.rootId === 400 ? 'red' : props.rootId === 200 ? 'green' : 'inherit', position: 'absolute', left: '50%' }}>
          {props.rootId === 300 || props.rootId === 400
            ? formatLargeNumber(props.node.liability)
            : props.node.droppable
            ? ""
            : formatLargeNumber(props.node.value)}
        </span>
        {droppable && (
          <span style={{ marginLeft: 'auto', color: props.rootId === 400 ? 'red' : props.rootId === 200 ? 'green' : '#4a5568', position: 'absolute', left: '50%' }}>
            {formatLargeNumber(folderTotal)}
          </span>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Change Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleNameChange}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
