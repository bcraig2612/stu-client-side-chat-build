import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ConversationItem from "./ConversationItem";
import ComposeMessage from "./ComposeMessage";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from "@material-ui/core/Tooltip";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import { useSnackbar } from 'notistack';
import {requestSendMessage, useGetConversation} from "../customHooks";
import Pusher from "pusher-js";
import {mutate} from "swr";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

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
    fontSize: "1.2em",
    display: "flex"
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
  },
  backArrow: {
    marginRight: "10px",
    [theme.breakpoints.up('sm')]: {
      display: "none"
    },
  }
}));

// connect to pusher
// set up pusher
Pusher.logToConsole = true;
const pusher = new Pusher('66e7f1b4416d81db9385', {
  cluster: 'us3'
});

function ConversationMain(props) {
  const classes = useStyles();
  const [conversationDetails, setConversationDetails] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const {data, isLoading, isError} = useGetConversation(props.selectedConversation);

  // reference for end of message container
  const messagesEnd = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (data) {
      const channel = pusher.subscribe('channel_demo');
      channel.unbind('new-message');

      // new incoming messages
      channel.bind('new-message', function (message) {
        mutate(() => props.selectedConversation ? 'messages/?conversationID=' + props.selectedConversation : null, previousData => {
          console.log(previousData);
          return {...previousData, data: {messages: [...previousData.data.messages, message]}}
        }, false);
      });
    }
  });

  useEffect(() => {
    if (data) {
      // subscribe to inbox notifications
      const channel = pusher.subscribe('channel_demo');

      // new incoming messages
      channel.bind('new-message', function(message) {
        mutate(() => props.selectedConversation ? 'messages/?conversationID=' + props.selectedConversation : null,  previousData => {
          console.log(previousData);
          return {...previousData, data: { messages: [...previousData.data.messages, message]} }
        }, false);
      });
    }
  }, [props.selectedConversation]);

  useEffect(() => {
    if (props.conversations) {
      setConversationDetails(props.conversations.data.conversations.find(element => element.id == props.selectedConversation));
    }
  }, [props.conversations, props.selectedConversation]);

  // scroll to most recent chat messages on render
  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({behavior: "smooth"});
    }
  }, [data]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const sendMessage = async (message) => {
    const id = props.selectedConversation;
    // mutate(() => props.selectedConversation ? 'messages/?conversationID=' + id : null,  previousData => {
    //   console.log(previousData);
    //   return {...previousData, data: { messages: [...previousData.data.messages, {id: Math.random(), body: message}]} }
    // }, false);

    const result = await requestSendMessage(message, id);
    // do something else here after firstFunction completes
    if (result && result.status == 'success') {

    }
  }

  function handleStatusChange() {
    const variant = 'error';
    enqueueSnackbar('Could not load conversation.', { variant });
  }

  function handleBackArrow() {
    props.setMobileConversationListOpen();
  }

  let messages = null;

  if (data) {
    messages = data.data.messages.map((message) => {
      return <ConversationItem key={message.id} message={message} />;
    });
  }

  if (isError) {
    messages = (
      <p>Error loading messages.</p>
    );
  }

  if (isLoading && !isError) {
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
        <div className={classes.visitorName}>
          <IconButton size="medium" aria-label="Close" onClick={handleBackArrow} className={classes.backArrow}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <div>
            <Chip size="small" label="Inactive" color="secondary" /> {conversationDetails.name}
            <div style={{fontSize: ".8em", fontWeight: "normal"}}>
              {conversationDetails.email_address}
            </div>
          </div>
        </div>

        <IconButton size="medium" aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Move to Closed</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete Conversation</MenuItem>
        </Menu>
      </div>
      <div className={classes.conversationContainer}>
        {messages}
        <div style={{float: "left", clear: "both"}}
             ref={messagesEnd}>
        </div>
      </div>
      <ComposeMessage sendMessage={sendMessage} />
    </div>
  );
}

export default ConversationMain;