import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import find from 'lodash/find';
import withRoot from './../../withRoot';
import { Route } from 'react-router-dom'
import AppDrawer from './AppDrawer';
//import { pageToTitle } from './../utils/helpers';

const styles = theme => ({
  root: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 20
  }
});


const pages = [
  {
    pathname: '/ch1',
    children: [
      {
        pathname: '/ch1/sec1',
      },
      {
        pathname: '/ch1/sec2',
      },
      {
        pathname: '/ch1/sec3',
      },
    ],
  },
  {
    pathname: '/ch2',
    children: [
      {
        pathname: '/ch2/sec1',
      },
      {
        pathname: '/ch2/sec2',
      },
      {
        pathname: '/ch2/sec3',
      },
    ],
  },
  {
    pathname: '/ch3',
    children: [
      {
        pathname: '/ch3/sec1',
      },
      {
        pathname: '/ch3/sec2',
      },
      {
        pathname: '/ch3/sec3',
      },
    ],
  },
  {
    pathname: '/',
    title: false,
  },
];

function findActivePage(currentPages, url) {
  const activePage = find(currentPages, page => {
    if (page.children) {
      return url.pathname.indexOf(page.pathname) === 0;
    }
    // Should be an exact match if no children
    return url.pathname === page.pathname;
  });

  if (!activePage) {
    return null;
  }

  // We need to drill down
  if (activePage.pathname !== url.pathname) {
    return findActivePage(activePage.children, url);
  }

  return activePage;
}

const ShowChapterSection = ({ match }) => (
<div>
  <Typography type="display1" gutterBottom>
    Florida
  </Typography>
  <Typography type="subheading" gutterBottom>
    has 20 million people...
  </Typography>
  <div>
    <h3>Chapter: {match.params.ch}</h3>
    <h4>Section: {match.params.sec}</h4>
  </div>
</div>
)

class AppFrame extends React.Component {
  state = {
    mobileOpen: false,
  };

  getChildContext() {
    let myurl = {};
    myurl.pathname = this.props.history.location.pathname
    return {
      url: myurl ? myurl : null,
      pages,
      activePage: findActivePage(pages, myurl),
    };
  }

  handleDrawerOpen = () => {
    this.setState({ mobileOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ mobileOpen: false });
  };

  render() {
    const { classes } = this.props;
/*
    if (!this.context.activePage) {
      throw new Error('Missing activePage.');
    }

    const title =
      this.context.activePage.title !== false ? pageToTitle(this.context.activePage) : null;
*/
    const title = 'Hola from Florida AppFrame'

    let disablePermanent = false;
    let navIconClassName = '';
    let appBarClassName = classes.appBar;

    if (title === null) {
      // home route, don't shift app bar or dock drawer
      disablePermanent = true;
      appBarClassName += ` ${classes.appBarHome}`;
    } else {
      navIconClassName = classes.navIconHide;
      appBarClassName += ` ${classes.appBarShift}`;
    }

    return (
      <div className={classes.root}>
        <AppBar className={appBarClassName}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={navIconClassName}
            >
              <MenuIcon />
            </IconButton>
            {title !== null && (
              <Typography className={classes.title} variant="title" color="inherit" noWrap>
                {title}
              </Typography>
            )}

            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
        <AppDrawer
          className={classes.drawer}
          disablePermanent={disablePermanent}
          onClose={this.handleDrawerClose}
          onOpen={this.handleDrawerOpen}
          mobileOpen={this.state.mobileOpen}
        />

        <div style={{ flex: 1, padding: '10px' }}>
            <Route
              path="/:ch/:sec"
              component={ShowChapterSection}
            />
        </div>
      </div>
    );
  }
}

AppFrame.propTypes = {
  classes: PropTypes.object.isRequired,
};

AppFrame.childContextTypes = {
  url: PropTypes.object,
  pages: PropTypes.array,
  activePage: PropTypes.object,
};

export default withRoot(withStyles(styles)(AppFrame));
