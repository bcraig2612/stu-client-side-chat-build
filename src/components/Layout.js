import React from 'react';
import useStyles from "./styles/Layout.styles";

function Layout(props) {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      {props.children}
    </div>
  );
}

export default Layout;