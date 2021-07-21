import React from 'react';
import useStyles from "./styles/ComposeMessageLocked.styles";
import LockIcon from '@material-ui/icons/Lock';

function ComposeMessage(props) {
  const classes = useStyles();

  return (
    <div className={classes.composeMessageContainer}>
      <LockIcon style={{marginRight: "10px"}} /> Responding is not available once a conversation is closed.
    </div>
  );
}

export default ComposeMessage;