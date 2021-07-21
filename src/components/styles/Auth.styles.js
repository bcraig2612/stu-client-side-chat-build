import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  authContainer: {
    display: "flex",
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    height: "100vh",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
}));

export default useStyles;