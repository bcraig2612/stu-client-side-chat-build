import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ConversationItem from "./ConversationItem";
import ComposeMessage from "./ComposeMessage";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from "@material-ui/core/Tooltip";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import { useSnackbar } from 'notistack';
import {useGetConversation} from "../customHooks";
import Pusher from "pusher-js";
import {mutate} from "swr";

const useStyles = makeStyles((theme) => ({
  conversationMain: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgb(228, 233, 240)",
    flex: "0 0 64px",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  visitorName: {
    fontWeight: "bold",
    fontSize: "1.2em"
  },
  conversationContainer: {
    backgroundColor: "#fff",
    flex: "1",
    overflowY: "scroll",
    padding: theme.spacing(2),
  },
  skeletonItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "10px",
    '& span': {
      borderRadius: "26px 26px 3px 26px",
    }
  },
  skeletonItemVisitor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "10px",
    '& span': {
      borderRadius: "26px 26px 26px 3px"
    }
  },
  infoBoxContainer: {
    display: "flex",
    alignSelf: "center",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  infoBox: {
    border: "1px solid rgb(228, 233, 240);",
    maxWidth: "536px",
    width: "90%",
    padding: "20px"
  }
}));

function ConversationMain(props) {
  const classes = useStyles();
  const [conversationMessages, setConversationMessages] = useState([]);
  const [conversationMessagesLoading, setConversationMessagesLoading] = useState(true);
  const [conversationDetails, setConversationDetails] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  let {data, isLoading, isError} = useGetConversation(props.selectedConversation);

  useEffect(() => {
    if (data) {
      // connect to pusher
      // set up pusher
      Pusher.logToConsole = true;
      const pusher = new Pusher('66e7f1b4416d81db9385', {
        cluster: 'us3'
      });
      // subscribe to inbox notifications
      let channel = pusher.subscribe(data.conversation.channel_name);

      // new incoming messages
      channel.bind('new-message', function(message) {
        mutate(`http://localhost:9000/api/dummy_data.php?id=${props.selectedConversation}`,  data => {
          return {...data, messages: [...data.messages, message]}
        }, false)
      });
    }
  }, [props.selectedConversation]);

  useEffect(() => {
    if (props.conversations) {
      setConversationDetails(props.conversations.conversations.find(element => element.id == props.selectedConversation));
    }
  }, [props.conversations, props.selectedConversation]);

  function handleStatusChange() {
    //enqueueSnackbar('Status changed');
    const variant = 'error';
    enqueueSnackbar('Could not load conversation.', { variant });
  }

  let messages = conversationMessages.map((message) => {
    return <ConversationItem key={message.id} message={message} />;
  });

  if (data) {
    messages = data.messages.map((message) => {
      return <ConversationItem key={message.id} message={message} />;
    });

  }

  if (isLoading) {
    messages = (
      <React.Fragment>
        <div className={classes.skeletonItemVisitor}>
          <Skeleton variant="rect" width={"200px"} height={50} />
        </div>
        <div className={classes.skeletonItem}>
          <Skeleton variant="rect" width={"200px"} height={50} />
        </div>
        <div className={classes.skeletonItem}>
          <Skeleton variant="rect" width={"200px"} height={80} />
        </div>
        <div className={classes.skeletonItem}>
          <Skeleton variant="rect" width={"200px"} height={50} />
        </div>
      </React.Fragment>
    );
  }

  if (! props.selectedConversation || ! conversationDetails) {
    return (
      <div className={classes.conversationMain}>
        <div className={classes.infoBoxContainer}>
          <div className={classes.infoBox}>
            <h1>When visitors on your site start a chat, you'll see it here!</h1>
            <Button variant="outlined" color="primary" href="#outlined-buttons">
              Support center
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.conversationMain}>
      <div className={classes.header}>
        <div className={classes.visitorName}>{conversationDetails.name}</div>
        <Tooltip title="Close" arrow>
          <IconButton size="small" aria-label="Close" onClick={handleStatusChange}>
            <CheckIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.conversationContainer}>
        {messages}
      </div>
      <ComposeMessage />
    </div>
  );
}

export default ConversationMain;