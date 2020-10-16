import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Pusher from "pusher-js";

// connect to pusher
// set up pusher
Pusher.logToConsole = false;
const pusher = new Pusher('66e7f1b4416d81db9385', {
  cluster: 'us3',
  authEndpoint: 'https://dev01.sotellus.com/API/chat/pusherAuthentication/',
  auth: {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('stu_jwt'),
    }
  }
});

const useStyles = makeStyles((theme) => ({
  composeMessageContainer: {
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    height: "auto",
    minHeight: "100px",
    borderTop: "1px solid rgb(228, 233, 240)",
    display: "flex",
    flexDirection: "column"
  },
  composeActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ComposeMessage(props) {
  const classes = useStyles();
  const [composeMessageValue, setComposeMessageValue] = useState('');
  const [sendDisabled, setSendDisabled] = useState(false);

  function handleChange(e) {
    setComposeMessageValue(e.target.value);
    const channel = pusher.subscribe(props.conversation.channel_name);
    channel.trigger('client-typing', { });
  }

  function sendMessage() {
    if (composeMessageValue.length < 1) {
      return false;
    }
    setSendDisabled(true);
    setTimeout(() => setSendDisabled(false), 1000);
    props.sendMessage(composeMessageValue);
    setComposeMessageValue('');
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