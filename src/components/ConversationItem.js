import React from 'react';
import moment from "moment";
import useStyles from "./styles/ConversationItem.styles";
import Link from "@material-ui/core/Link";

function ConversationItem(props) {
  const classes = useStyles(props);
  let sent = moment.unix(props.message.sent);
  sent = sent.local().calendar();

  let body = props.message.body;

  if (body) {
    body += '';
    body = body.split('\n').map(function(item, key) {
      return (
        <span key={key}>
        {item}
          <br/>
      </span>
      )
    })
  }

  if (props.conversation && props.conversation.sms_opt_in) {
    body = (
      <React.Fragment>
        {props.conversation.name} wants you to send them a text message! Click the link or copy their phone number: <Link href={"sms:" + props.conversation.phone_number}>{props.conversation.phone_number}</Link>
      </React.Fragment>
    );
  }

  if (props.conversation && props.conversation.call_opt_in) {
    body = (
      <React.Fragment>
        {props.conversation.name} wants you to call them! Click the link or copy their phone number: <Link href={"tel:" + props.conversation.phone_number}>{props.conversation.phone_number}</Link>
      </React.Fragment>
    );
  }

  if (props.conversation && props.conversation.email_opt_in) {
    body = (
      <React.Fragment>
        {props.conversation.name} wants you to email them! Click the link or copy their email address: <Link href={"mailto:" + props.conversation.email_address}>{props.conversation.email_address}</Link>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.conversationItem}>
      <div className={classes.bubble}>
        {body}
      </div>
      <div className={classes.timeStamp}>{sent}</div>
    </div>
  );
}

export default ConversationItem;