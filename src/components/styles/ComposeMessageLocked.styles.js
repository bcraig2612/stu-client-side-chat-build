import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  composeMessageContainer: {
    padding: theme.spacing(2),
    backgroundColor: "rgb(244, 246, 249)",
    color: "rgb(135, 135, 135)",
    height: "auto",
    minHeight: "40px",
    borderTop: "1px solid rgb(228, 233, 240)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('xs')]: {
      height: "auto",
      position: "fixed",
      bottom: "0",
      width: "100%"
    },
    zIndex: "1000"
  }
}));

export default useStyles;