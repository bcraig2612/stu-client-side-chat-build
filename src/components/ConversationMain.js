import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import Pusher from "pusher-js";
import { mutate } from "swr";
import useStyles from "./styles/ConversationMain.styles";
import { visitorLeftCloseConversation, requestAcceptConversation, requestDeleteConversation, requestSendMessage, requestUpdateConversation, useGetConversation } from "../customHooks";
import ConversationItem from "./ConversationItem";
import ComposeMessage from "./ComposeMessage";
import ComposeMessageLocked from "./ComposeMessageLocked";
import ConversationLog from "./ConversationLog";
import TypingIndicator from "./TypingIndicator";
import ContactAvatar from "./ContactAvatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// connect to pusher
// set up pusher
const pusherKey = process.env.REACT_APP_STU_PUSHER_API_KEY;
const apiURL = process.env.REACT_APP_STU_API_URL;

Pusher.logToConsole = false;
const pusher = new Pusher(pusherKey, {
  cluster: "us3",
  authEndpoint: apiURL + "pusherAuthentication/",
  auth: {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("stu_jwt"),
    },
  },
});

function ConversationMain(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const { data, isLoading, isError } = useGetConversation(props.selectedConversation);

  // reference for end of message container
  const messagesEnd = useRef(null);
  const [submittingAcceptConversation, setSubmittingAcceptConversation] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [contactIsOnline, setContactIsOnline] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

// =====================================================ADDED 08/24/21===================================================================
  useEffect(() => {
    if (data && data.data.conversation && data.data.conversation.accepted === 1 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
      if(contactIsOnline === false && !data.data.conversation.inactive_timestamp) {
        const timer = setTimeout(() => {
          // console.log("Hit 1st timeout");
          visitorLeftCloseConversation(data.data.conversation.id).then(() => {
            visitorLeft();
          });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactIsOnline])
// ========================================================================================================================================

  useEffect(() => {
    if (data && data.data.conversation) {
      const channel = pusher.subscribe(data.data.conversation.channel_name);
      channel.unbind("new-message");
      channel.unbind("client-typing");

      channel.bind("pusher:subscription_succeeded", function () {
        if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
          setContactIsOnline(data.data.conversation.id);
        } else {
          setContactIsOnline(false);
        }
      });

      channel.bind("pusher:member_added", function (member) {
        if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
          setContactIsOnline(data.data.conversation.id);
        } else {
          setContactIsOnline(false);
        }
      });

      channel.bind("pusher:member_removed", function (member) {
        if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
          setContactIsOnline(data.data.conversation.id);
        } else {
          setContactIsOnline(false);
        }
      });

      // new incoming messages
      channel.bind("new-message", function (message) {
        setShowTypingIndicator(false);
        mutate(
          () =>
            props.selectedConversation
              ? "messages/?conversationID=" + props.selectedConversation
              : null,
          (previousData) => {
            return {
              ...previousData,
              data: {
                conversation: previousData.data.conversation,
                messages: [...previousData.data.messages, message],
              },
            };
          },
          false
        );
      });

      channel.bind("client-typing", function (data) {
        setShowTypingIndicator(data.id);
        setTimeout(() => {
          setShowTypingIndicator(false);
        }, 4000);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data && data.data.conversation) {
      // subscribe to inbox notifications
      const channel = pusher.subscribe(data.data.conversation.channel_name);
      channel.unbind("new-message");
      channel.unbind("client-typing");

      if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
        setContactIsOnline(data.data.conversation.id);
      } else {
        setContactIsOnline(false);
      }

      channel.bind("pusher:member_added", function (member) {
        if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
          setContactIsOnline(data.data.conversation.id);
        } else {
          setContactIsOnline(false);
        }
      });

      channel.bind("pusher:member_removed", function (member) {
        if (channel.members && channel.members.count === 2 && !data.data.conversation.deactivated_timestamp && !data.data.conversation.inactive_timestamp) {
          setContactIsOnline(data.data.conversation.id);
        } else {
          setContactIsOnline(false);
        }
      });

      // new incoming messages
      channel.bind("new-message", function (message) {
        setShowTypingIndicator(false);
        mutate(
          () =>
            props.selectedConversation
              ? "messages/?conversationID=" + props.selectedConversation
              : null,
          (previousData) => {
            return {
              ...previousData,
              data: {
                conversation: previousData.data.conversation,
                messages: [...previousData.data.messages, message],
              },
            };
          },
          false
        );
      });

      channel.bind("client-typing", function (data) {
        setShowTypingIndicator(data.id);
        setTimeout(() => {
          setShowTypingIndicator(false);
        }, 4000);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedConversation]);

  // scroll to most recent chat messages on render
  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const triggerTypingEvent = () => {
    const channel = pusher.subscribe(data.data.conversation.channel_name);
    channel.trigger("client-typing", {});
  };

  const handleChangeStatus = (active) => {
    setAnchorEl(null);
    let res = requestUpdateConversation(active, props.selectedConversation);
    res
      .then((data) => {
        const filter = "open";
        history.push("/conversation/?filter=" + filter);
        mutate("messages/?conversationID=" + props.selectedConversation);
        mutate("conversations/?filter=" + filter);
      })
      .catch(() => {
        displayError("Error updating conversation.");
      });
  };

  const handleDelete = (active) => {
    setAnchorEl(null);
    let res = requestDeleteConversation(props.selectedConversation);
    res
      .then((data) => {
        const filter = active ? "open" : "closed";
        history.push("/conversation/?filter=" + filter);
        mutate("conversations/?filter=" + filter);
        displaySuccess("Conversation deleted.");
      })
      .catch(() => {
        displayError("Error deleting conversation.");
      });
  };

  function visitorLeft() {
    setAnchorEl(null);
    history.push("/conversation/"+props.selectedConversation+"?filter=closed");
    displayNotification("Visitor left the conversation.");
    setTimeout(() => {
      // console.log("Hit 2nd timeout");
      mutate("messages/?conversationID=" + props.selectedConversation);
    }, 2000);
  };

  const sendMessage = async (message) => {
    const id = props.selectedConversation;

    const res = requestSendMessage(message, id);
    res
      .then((data) => {
        console.log("message sent");
      })
      .catch(() => {
        displayError("Error sending message.");
      });
  };

  const acceptConversation = async (id) => {
    setSubmittingAcceptConversation(true);
    const res = requestAcceptConversation(id);
    res
      .then((data) => {
        setSubmittingAcceptConversation(false);
        mutate("messages/?conversationID=" + id);
        mutate("conversations/?filter=open");
      })
      .catch(() => {
        setSubmittingAcceptConversation(false);
        displayError("Error accepting conversation.");
      });
  };

  function displaySuccess(message) {
    const variant = "success";
    enqueueSnackbar(message, { variant });
  }

  function displayNotification(message) {
    const variant = "warning";
    enqueueSnackbar(message, { variant });
  }

  function displayError(message) {
    const variant = "error";
    enqueueSnackbar(message, { variant });
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
    messages = <p>Error loading messages.</p>;
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

  if (!props.selectedConversation) {
    return (
      <div className={classes.conversationMain}>
        <div className={classes.header}>
          <div className={classes.visitorName} style={{ alignItems: "center" }}>
            <IconButton
              size="medium"
              aria-label="Close"
              onClick={handleBackArrow}
              className={classes.backArrow}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
            <div>Live Chat</div>
          </div>
        </div>
        <div className={classes.infoBoxContainer}>
          <div className={classes.infoBox}>
            <h1>
              When visitors on your site start a chat, you'll see it here!
            </h1>
            <Button
              variant="outlined"
              color="primary"
              href="http://support.sotellus.com/support/solutions"
              target="_blank"
            >
              Support center
            </Button>
          </div>
        </div>
      </div>
    );
  }

  let contentHeader = (
    <div className={classes.header}>
      <div className={classes.visitorName}>
        <IconButton
          size="medium"
          aria-label="Close"
          onClick={handleBackArrow}
          className={classes.backArrow}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
        <div>
          <Skeleton variant="text" width={"200px"} height={30} />
          <div style={{ fontSize: ".8em", fontWeight: "normal" }}>
            <Skeleton variant="text" width={"200px"} height={20} />
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoading && !isError && data.data.conversation) {
    contentHeader = (
      <div className={classes.header}>
        <div className={classes.visitorName}>
          <IconButton
            size="medium"
            aria-label="Close"
            onClick={handleBackArrow}
            className={classes.backArrow}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
          <ContactAvatar
            online={data.data.conversation.id === contactIsOnline}
            name={data.data.conversation.name}
          />
          <div style={{ alignItems: "center", display: "flex" }}>
            {data.data.conversation.name}
          </div>
        </div>

        <IconButton
          size="medium"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {data.data.conversation.active === 1 && (
            <MenuItem onClick={() => handleChangeStatus(0)}>
              Change Status to Closed
            </MenuItem>
          )}
          {data.data.conversation.active === 0 && (
            <MenuItem
              onClick={() => handleDelete(data.data.conversation.active)}
            >
              Delete Conversation
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }

  return (
    <div className={classes.conversationMain}>
      {contentHeader}
      <div className={classes.conversationContainer}>
        {!isLoading && !isError && data.data.conversation && (
          <ConversationLog
            message={"Beginning of conversation"}
            sent={data.data.conversation.created}
          />
        )}
        {messages}
        {showTypingIndicator === props.selectedConversation && (
          <TypingIndicator />
        )}
        {!isLoading &&
          !isError &&
          data.data.conversation.contact_opt_in_timestamp && (
            <ConversationItem
              conversation={data.data.conversation}
              message={{
                sent: data.data.conversation.contact_opt_in_timestamp,
                sent_by_contact: 1,
              }}
            />
          )}
        {!isLoading &&
          !isError &&
          data.data.conversation.deactivated_timestamp && (
            <ConversationLog
              message={"Conversation closed"}
              sent={data.data.conversation.deactivated_timestamp}
            />
          )}
        {!isLoading &&
          !isError &&
          data.data.conversation.inactive_timestamp && (
            <ConversationLog
              message={"Visitor left the conversation"}
              sent={data.data.conversation.inactive_timestamp}
            />
          )}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>
      {!isLoading && !isError && data.data.conversation.active === 1 && (
        <ComposeMessage
          triggerTypingEvent={triggerTypingEvent}
          submittingAcceptConversation={submittingAcceptConversation}
          acceptConversation={acceptConversation}
          conversation={data.data.conversation}
          sendMessage={sendMessage}
        />
      )}
      {!isLoading && !isError && data.data.conversation.active === 0 && (
        <ComposeMessageLocked />
      )}
    </div>
  );
}

export default ConversationMain;
