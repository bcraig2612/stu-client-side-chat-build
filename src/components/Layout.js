import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  layout: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    width: "100wh",
  }
}));

function Layout(props) {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      {props.children}
    </div>
  );
}

export default Layout;