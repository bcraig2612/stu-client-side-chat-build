import React from 'react';
import moment from "moment";
import useStyles from "./styles/ConversationLog.styles";

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