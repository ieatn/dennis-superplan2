import { Tree } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./TreeView.module.css";
import '../App.css';

export const TreeView = (props) => (
  <Tree tree={props.tree} rootId={props.rootId} onDrop={props.onDrop} 
  // you really need a module css file for the tree drop zone to work
  classes={{
    root: styles.treeRoot,
    draggingSource: styles.draggingSource,
    dropTarget: styles.dropTarget,
  }} 
    render={(node, options) => (
      <CustomNode
        node={node}
        {...options}
        rootId={props.rootId}
        deleteFolder={props.deleteFolder}
      />
    )}
    dragPreviewRender={(monitorProps) => (
      <CustomDragPreview monitorProps={monitorProps} />
    )}
  />
);
