import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Link, useHistory} from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  conversationList: {
    backgroundColor: "#fff",
    minWidth: "300px",
    maxWidth: "375px",
    width: "33.33%",
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgb(228, 233, 240)",
    marginLeft: "0px",
    transition: "margin-left 0.3s ease-in-out 0s",
    [theme.breakpoints.down('xs')]: {
      position: "fixed",
      left: "0",
      right: "0",
      top: "0",
      bottom: "0",
      maxWidth: "100%",
      width: "100%",
      zIndex: "2000"
    },
  },
  header: {
    padding: theme.spacing(2),
  },
  title: {
    fontSize: "1.6em",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationListItems: {
    marginTop: "1px",
    display: "flex",
    flex: "1",
    flexDirection: "column",
    overflow: "scroll"
  },
  listItem: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    color: "#333",
    textDecoration: "none",
    '&:hover': {
      background: "rgb(244, 246, 249)"
    }
  },
  skeletonItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  selectedConversation: {
    background: theme.palette.primary.main,
    color: "#fff",
    '&:hover': {
      background: theme.palette.primary.main
    }
  },
  visitorName: {
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  lastMessage: {

  }
}));

function ConversationList(props) {
  const classes = useStyles();
  const history = useHistory();

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

  if (!props.conversationsLoading) {
    conversations = props.conversations.conversations.map((conversation) => {
      const status = conversation.active ? 'open' : 'closed';

      // filter conversations based on status
      if (props.filter !== status) {
        return false;
      }

      let classList = classes.listItem;

      // check if conversation is selected
      if (props.selectedConversation === conversation.id.toString()) {
        classList += ' ' + classes.selectedConversation;
      }

      return (
        <Link key={conversation.id} to={"/conversation/" + conversation.id + '?filter=' + status} className={classList}>
          <div className={classes.visitorName}>{conversation.name}</div>
          <div className={classes.lastMessage}>{conversation.body}</div>
        </Link>
      );
    });
  }

  const filterChange = (event, newValue) => {
    let link = "/conversation/";
    if (props.selectedConversation) {
      link += props.selectedConversation;
    }
    history.push(link + '?filter=' + newValue);
    props.setFilter(newValue);
  };

  return (
    <div className={classes.conversationList}>
      <div className={classes.header}>
        <div className={classes.title}>
          <span>Live Chat</span>
          <img src="https://lirp-cdn.multiscreensite.com/57956d42/dms3rep/multi/opt/Logo_1-640w.png" width="130px" alt="logo" />
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
          <Tab label="Open" value="open" />
          <Tab label="Closed" value="closed" />
        </Tabs>
      </Paper>

      <div className={classes.conversationListItems}>
        {conversations}
      </div>
    </div>
  );
}

export default ConversationList;