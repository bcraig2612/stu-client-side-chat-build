import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  composeMessageContainer: {
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    height: "auto",
    minHeight: "100px",
    borderTop: "1px solid rgb(228, 233, 240)",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down('xs')]: {
      height: "127px",
      position: "fixed",
      bottom: "0",
      width: "100%"
    },
    zIndex: "1000"
  },
  composeActions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end"
  }
}));

export default useStyles;