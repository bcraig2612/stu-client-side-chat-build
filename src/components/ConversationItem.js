import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  conversationItem: props => ({
    textAlign: !props.message.sent_by_contact ? "right" : "left",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
  }),
  bubble: props => ({
    textAlign: "left",
    color: !props.message.sent_by_contact ? "#fff" : "#333",
    backgroundColor: !props.message.sent_by_contact ? theme.palette.info.main : "rgb(244, 246, 249)",
    borderRadius: !props.message.sent_by_contact ? "26px 26px 3px 26px" : "26px 26px 26px 3px",
    padding: "12px 20px",
    display: "inline-block",
    maxWidth: "54%",
    overflowWrap: "break-word",
    lineHeight: "1.4",
    fontSize: "14px",
    position: "relative",
    marginBottom: "3px",
  }),
  timeStamp: {
    fontSize: "12px",
    lineHeight: "1.25",
    color: "rgb(99, 114, 125)",
    margin: "2px 0px 0px 1px",
  }
}));

function ConversationItem(props) {
  const classes = useStyles(props);
  let sent = moment.unix(props.message.sent);
  sent = sent.local().calendar();

  let body = props.message.body;

  if (props.conversation) {
    body = (
      <React.Fragment>
        {props.conversation.name} wants you to send them a text message! Click the link or copy their phone number: <Link href={"sms:" + props.conversation.phone_number}>{props.conversation.phone_number}</Link>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.conversationItem}>
      <div className={classes.bubble}>{body}</div>
      <div className={classes.timeStamp}>{sent}</div>
    </div>
  );
}

export default ConversationItem;