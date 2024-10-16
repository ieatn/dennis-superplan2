import React, { useEffect, useState } from "react";
import { TypeIcon } from "./TypeIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const [childNodes, setChildNodes] = useState([]);

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
        <div className="node-text" style={nodeTextStyle}>{props.node.text}</div>
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
      </div>
    </div>
  );
};
