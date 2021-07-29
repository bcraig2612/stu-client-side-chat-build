import React, { useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { useGetUnreadMessageCount } from "../customHooks";
import logo from '../soTellUs.png';
import useStyles from './styles/ConversationList.styles';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Skeleton from "@material-ui/lab/Skeleton";
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ForumIcon from '@material-ui/icons/Forum';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Badge from "@material-ui/core/Badge";
import DoneIcon from '@material-ui/icons/Done';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import SmsIcon from '@material-ui/icons/Sms';

function truncateText(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

function ConversationList(props) {
  const classes = useStyles();
  const history = useHistory();
  const {data, isLoading, isError} = useGetUnreadMessageCount();

  useEffect(() => {
    if (data && data.data.unread_message_count > 0) {
      document.title = "(" + data.data.unread_message_count + ") Dev-Chat-Dashboard";
    } else {
      document.title = "Dev-Chat-Dashboard";
    }
  }, [data]);

  let conversations = (
    <React.Fragment>
      <div className={classes.skeletonItem}>
        <Skeleton variant="text" width={"80%"} height={80} />
      </div>
      <div className={classes.skeletonItem}>
        <Skeleton variant="text" width={"80%"} height={80} />
      </div>
      <div className={classes.skeletonItem}>
        <Skeleton variant="text" width={"80%"} height={80} />
      </div>
    </React.Fragment>
  );

  if (!props.conversationsLoading && !props.errorLoadingConversation && props.conversations.data.conversations.length) {
    conversations = props.conversations.data.conversations.map((conversation) => {
      // console.log(conversation);
      const status = conversation.active ? 'open' : 'closed';
      const accepted = (conversation.active !== 0 && conversation.accepted);
      const leftContactInfo = !!conversation.contact_opt_in_timestamp;
      const contactViaCall = !!conversation.call_opt_in;
      const contactViaSMS = !!conversation.sms_opt_in;
      const contactViaEmail = !!conversation.email_opt_in;

      // filter conversations based on status
      if (props.filter !== status) {
        return false;
      }

      let classList = classes.listItem;

      // check if conversation is selected
      if (props.selectedConversation === conversation.id.toString()) {
        classList += ' ' + classes.selectedConversation;
      }

      if (accepted === 0) {
        classList += ' ' + classes.incomingConversation;
      }

      let sent = moment.unix(conversation.sent);
      sent = sent.local().calendar();

      return (
        <Link onClick={props.setMobileConversationListOpen} key={conversation.id} to={"/conversation/" + conversation.id + '?filter=' + status} className={classList}>
          <div className={classes.listItemWrapper}>
            {accepted === 0 && (
              <div className={classes.listItemRinging}>
                <NotificationsActiveIcon />
              </div>
            )}

            {leftContactInfo && contactViaCall &&(
              <div className={classes.leftContactInfoIcon}>
                <PhoneIcon fontSize="small" htmlColor="#3F51B5" />
              </div>
            )}

            {leftContactInfo && contactViaSMS &&(
              <div className={classes.leftContactInfoIcon}>
                <SmsIcon fontSize="small" htmlColor="#3F51B5" />
              </div>
            )}

            {leftContactInfo && contactViaEmail &&(
              <div className={classes.leftContactInfoIcon}>
                <EmailIcon fontSize="small" htmlColor="#3F51B5" />
              </div>
            )}

            {accepted === 1 && conversation.unread > 0 && props.selectedConversation != conversation.id && (
              <div className={classes.listItemRinging}>
                <Badge badgeContent={conversation.unread} max={99} color="primary" />
              </div>
            )}
            <div className={classes.listItemContent}>
              <div className={classes.listItemTop}>
                <span className={classes.visitorName}>
                  {truncateText(conversation.name, 25)}
                </span>
                <span className={classes.listItemSent}>
                  {sent}
                </span>
              </div>
              <div className={classes.lastMessage}>{conversation.body}</div>
            </div>
          </div>
        </Link>
      );
    });
  }

  if (!props.conversationsLoading && !props.errorLoadingConversation && !props.conversations.data.conversations.length) {
    conversations = (
      <div className={classes.noResultsContainer}>
        {props.filter === "open" && (
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}><QuestionAnswerIcon /> No Open Conversations.</div>
        )}
        {props.filter === "closed" && (
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}><DoneIcon /> No Closed Conversations.</div>
        )}
      </div>
    );
  }

  if (!props.conversationsLoading && props.errorLoadingConversation) {
    conversations = (
      <div className={classes.noResultsContainer}>
        No {props.filter} conversations found.
      </div>
    );
  }

  const filterChange = (event, newValue) => {
    let link = "/conversation/";
    if (props.selectedConversation) {
      link += props.selectedConversation;
    }
    history.push(link + '?filter=' + newValue);
    props.setFilter(newValue);
  };

  let containerClasses = classes.conversationList;

  if (!props.mobileConversationListOpen) {
    containerClasses += ' ' + classes.mobileHidden;
  }

  return (
    <div className={containerClasses}>
      <div className={classes.header}>
        <div className={classes.title}>
          <span>Live Chat</span>
          <img src={logo} width="130px" alt="logo" />
        </div>
      </div>

      <Paper square>
        <Tabs
          value={props.filter}
          indicatorColor="primary"
          textColor="primary"
          aria-label="disabled tabs example"
          variant="fullWidth"
          onChange={filterChange}
        >
          <Tab label={(
            <div className={classes.tabContent}>
              <span className={classes.tabLabel}>Open</span>
              <Badge badgeContent={(!isLoading && !isError) ? data.data.unread_message_count : 0} color="primary" max={99}><ForumIcon /></Badge>
            </div>
          )} value="open" />
          <Tab label={(
            <div className={classes.tabContent}>
              <span className={classes.tabLabel}>Closed</span>
              <DoneIcon />
            </div>
          )} value="closed" />
        </Tabs>
      </Paper>

      <div className={classes.conversationListItems}>
        {conversations}
      </div>
    </div>
  );
}

export default ConversationList;