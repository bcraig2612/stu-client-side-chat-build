import React, { useState } from 'react';
import useStyles from "./styles/ComposeMessage.styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function ComposeMessage(props) {
  const classes = useStyles();
  const [composeMessageValue, setComposeMessageValue] = useState('');
  const [sendDisabled, setSendDisabled] = useState(false);
  const [typingIndicatorDisabled, setTypingIndicatorDisabled] = useState(false);

  function handleChange(e) {
    setComposeMessageValue(e.target.value);
    if (typingIndicatorDisabled === false) {
      props.triggerTypingEvent();
      setTypingIndicatorDisabled(true);
      setTimeout(() => {
        setTypingIndicatorDisabled(false);
      }, 4000)
    }
  }

  function sendMessage() {
    if (composeMessageValue.trim().length < 1 || sendDisabled) {
      return false;
    }
    setSendDisabled(true);
    setTimeout(() => setSendDisabled(false), 1000);
    props.sendMessage(composeMessageValue);
    setComposeMessageValue('');
  }

  function handleKeyDown(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function acceptConversation() {
    props.acceptConversation(props.conversation.id);
  }

  let content = (
    <div className={classes.composeMessageContainer}>
      <TextField
        id="standard-multiline-flexible"
        label="Enter message"
        multiline
        fullWidth={true}
        rowsMax={4}
        value={composeMessageValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className={classes.composeActions}>
        <Button disabled={sendDisabled} variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );

  if (! props.conversation.accepted) {
    content = (
      <div className={classes.composeMessageContainer} style={{justifyContent: "center"}}>
        <Button fullWidth={true} disabled={props.submittingAcceptConversation} variant="contained" color="primary" onClick={acceptConversation}>
          Accept Conversation
        </Button>
      </div>
    );
  }

  return content;
}

export default ComposeMessage;