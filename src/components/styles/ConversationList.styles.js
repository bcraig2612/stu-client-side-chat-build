import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  conversationList: {
    backgroundColor: "#F2F3F4",
    minWidth: "375px",
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
  mobileHidden: {
    [theme.breakpoints.down('xs')]: {
      display: "none"
    },
  },
  header: {
    background: "#333",
    color: "#fff",
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
    minHeight: "72px",
    display: "flex",
    flexDirection: "column",
    color: "#333",
    textDecoration: "none",
    justifyContent: "center",
    '&:hover': {
      background: "rgb(244, 246, 249)"
    },
  },
  skeletonItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  selectedConversation: {
    background: "#eee",
    color: "#333",
    '&:hover': {
      background: "#eee",
    }
  },
  incomingConversation: {
    background: theme.palette.primary.main,
    color: "#fff",
    '&:hover': {
      background: theme.palette.primary.main
    }
  },
  visitorName: {
    fontWeight: "bold",
    fontSize: "1.2em",
    display: "flex",
    alignItems: "center"
  },
  lastMessage: {
    overflowX: "hidden",
    whiteSpace: "nowrap"
  },
  listItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItemSent: {
    fontSize: ".9em"
  },
  listItemWrapper: {
    display: "flex",
    position: "relative"
  },
  listItemContent: {
    flex: 1,
    maxWidth: "100%",
    overflow: "hidden"
  },
  listItemRinging: {
    flexBasis: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  noResultsContainer: {
    background: "#F2F3F4",
    textAlign: "center",
    padding: "20px"
  },
  tabContent: {
    display: "flex",
    flexDirection: "row"
  },
  tabLabel: {
    marginRight: "5px"
  },
  leftContactInfoIcon: {
    position: "absolute",
    right: "-11px",
    top: "-15px"
  }
}));

export default useStyles;