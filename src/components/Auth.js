import React from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useGetAuth, setJWT, useQuery, useCheckJWT, setClientid} from "../customHooks";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../soTellUsSquareLogo.png';
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
  const conversationID = query.get('id') ? query.get('id') : '';

  let history = useHistory();
  const {data, isLoading, isError} = useGetAuth(authCode);
  const {data: checkJWTData, isLoading: checkJWTLoading, isError: checkJWTError} = useCheckJWT();

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
    if (checkJWTData) {
      let link = "/conversation";
      if (conversationID) {
        link += "/" + conversationID;
      }
      history.push(link);
    }
    return (
      <div className={classes.authContainer}>
        <img style={{marginBottom: "10px"}} src={logo} alt="Logo" width="100px" />
        <p style={{textAlign: "center"}}>Oops, looks like this link is invalid.<br /> Please go back to <Link href="https://sotellus.com/my-profile/">SoTellUs.com and reopen the chat window.</Link></p>
      </div>
    );
  }

  if (!isError && data && data.data.token && data.data.clientid) {
    setJWT(data.data.token);
    setClientid(data.data.clientid);
    let link = "/conversation";
    if (conversationID) {
      link += "/" + conversationID;
    }
    window.location.href = link;
  }

  return null;
}