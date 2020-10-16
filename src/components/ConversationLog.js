import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  conversationItem: props => ({
    width: "100%",
    position: "relative",
    marginBottom: "10px",
    textAlign: "center",
    color: "rgb(99, 114, 125)"
  }),
  timeStamp: {
    fontSize: "12px",
    lineHeight: "1.25",
    color: "rgb(99, 114, 125)",
    margin: "2px 0px 0px 1px",
  },
  conversationLog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}));

function ConversationLog(props) {
  const classes = useStyles(props);
  let sent = moment.unix(props.sent);
  sent = sent.local().calendar();

  return (
    <div className={classes.conversationItem}>
      <div className={classes.conversationLog}>{props.message}</div>
      <div className={classes.timeStamp}>{sent}</div>
    </div>
  );
}

export default ConversationLog;