import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  conversationItem: props => ({
    textAlign: !props.message.sent_by_contact ? "right" : "left",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
  }),
  bubble: props => ({
    textAlign: "left",
    color: !props.message.sent_by_contact ? "#fff" : "#333",
    backgroundColor: !props.message.sent_by_contact ? theme.palette.info.main : "rgb(244, 246, 249)",
    borderRadius: !props.message.sent_by_contact ? "26px 26px 3px 26px" : "26px 26px 26px 3px",
    padding: "12px 20px",
    display: "inline-block",
    maxWidth: "54%",
    overflowWrap: "break-word",
    lineHeight: "1.4",
    fontSize: "14px",
    position: "relative",
    marginBottom: "3px",
  }),
  timeStamp: {
    fontSize: "12px",
    lineHeight: "1.25",
    color: "rgb(99, 114, 125)",
    margin: "2px 0px 0px 1px",
  }
}));

export default useStyles;