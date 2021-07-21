import React from 'react';
import useStyles from './styles/ContactAvatar.styles';
import OnlineBadge from "./styles/ContactAvatarOnlineBadge.styles";
import OfflineBadge from "./styles/ContactAvatarOfflineBadge.styles";
import Avatar from '@material-ui/core/Avatar';

export default function ContactAvatar(props) {
  const classes = useStyles();

  let badge = (
    <OfflineBadge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
    >
      <Avatar>{props.name.charAt(0)}</Avatar>
    </OfflineBadge>
  );

  if (props.online) {
    badge = (
      <OnlineBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
        <Avatar>{props.name.charAt(0)}</Avatar>
      </OnlineBadge>
    );
  }

  return (
    <div className={classes.root}>
      {badge}
    </div>
  );
}