/* -- mui -- */
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  liItem: {
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': {
      borderBottom: 0,
    },
  },
  avatar: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
  },
  title: {
    display: 'flex',
  },
  name: {
    textTransform: 'capitalize',
  },
  username: {
    color: theme.palette.colors.steelblue,
    fontWeight: 200,
  },
  body: {
    padding: '3px 36px 8px 36px',
  },
  commentAction: {
    marginLeft: 36,
  },
  toggleRepliesButton: {
    marginRight: 16,
  },
}));