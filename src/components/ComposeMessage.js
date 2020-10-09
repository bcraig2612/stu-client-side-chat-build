import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

  return (
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
}

export default ComposeMessage;