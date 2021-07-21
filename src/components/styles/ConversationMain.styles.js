import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  conversationMain: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F2F3F4",
    [theme.breakpoints.down("xs")]: {
      height: "100vh",
      maxHeight: "100vh",
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgb(228, 233, 240)",
    flex: "0 0 64px",
    background: "#F2F3F4",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      height: "64px",
      position: "fixed",
      width: "100%",
    },
    zIndex: "1000",
  },
  visitorName: {
    fontWeight: "bold",
    fontSize: "1.2em",
    display: "flex",
  },
  conversationContainer: {
    backgroundColor: "#F2F3F4",
    flex: "1",
    overflowY: "scroll",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginTop: "64px",
      marginBottom: "127px",
    },
    zIndex: "100",
  },
  skeletonItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "10px",
    "& span": {
      borderRadius: "26px 26px 3px 26px",
    },
  },
  skeletonItemVisitor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "10px",
    "& span": {
      borderRadius: "26px 26px 26px 3px",
    },
  },
  infoBoxContainer: {
    display: "flex",
    alignSelf: "center",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    border: "1px solid rgb(228, 233, 240);",
    maxWidth: "536px",
    width: "90%",
    padding: "20px",
  },
  backArrow: {
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

export default useStyles;