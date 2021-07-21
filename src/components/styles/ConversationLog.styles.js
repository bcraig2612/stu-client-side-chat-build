import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  conversationItem: props => ({
    width: "100%",
    position: "relative",
    marginBottom: "10px",
    textAlign: "center",
    color: "rgb(99, 114, 125)"
  }),
  timeStamp: {
    fontSize: "12px",
    lineHeight: "1.25",
    color: "rgb(99, 114, 125)",
    margin: "2px 0px 0px 1px",
  },
  conversationLog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}));

export default useStyles;