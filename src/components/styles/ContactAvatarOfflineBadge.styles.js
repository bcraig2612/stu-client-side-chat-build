import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const OfflineBadge = withStyles((theme) => ({
  badge: {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);

export default OfflineBadge;