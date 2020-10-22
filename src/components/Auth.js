import React from 'react';
import {useParams, useHistory, useLocation} from "react-router-dom";
import {useGetAuth, setJWT, useQuery} from "../customHooks";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../soTellUs.png';
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";

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

export default function Auth() {
  let { authCode } = useParams();
  let query = useQuery();
  const conversationID = query.get('conversationID') ? query.get('conversationID') : '';
  const queryFilter = query.get('filter') ? query.get('filter') : 'open';

  let history = useHistory();
  const {data, isLoading, isError} = useGetAuth(authCode);
  const classes = useStyles();

  if (isLoading) {
    return (
      <div className={classes.authContainer}>
        <img style={{marginBottom: "10px"}} src={logo} alt="Logo" width="100px" />
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={classes.authContainer}>
        <img style={{marginBottom: "10px"}} src={logo} alt="Logo" width="100px" />
        <p style={{textAlign: "center"}}>Oops, looks like this link is invalid.<br /> Please go back to <Link href="https://sotellus.com/my-profile/">SoTellUs.com and reopen the chat window.</Link></p>
      </div>
    );
  }

  if (!isError && data && data.data.token) {
    setJWT(data.data.token);
    let link = "/conversation";
    if (conversationID) {
      link += "/" + conversationID;
    }
    history.push(link);
  }

  return (<p>{data.data.token}</p>);
}