import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import find from 'lodash/find';
import withRoot from '../withRoot';

import { Route } from 'react-router-dom'
import AppDrawer from './../modules/components/AppDrawer';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
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
    <h3>Chapter: {match.params.ch}</h3>
    <h4>Section: {match.params.sec}</h4>
  </div>
)

class Index extends React.Component {

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

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes } = this.props;
    const title = 'Hola from Florida'
    let appBarClassName = classes.appBar;
    let navIconClassName = '';

    return (
      <div className={classes.root}>

        <AppBar className={appBarClassName}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={navIconClassName}
            >
              <MenuIcon />
            </IconButton>
            {title !== null && (
              <Typography className={classes.title} type="title" color="inherit" noWrap>
                {title}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        <AppDrawer
          className={classes.drawer}
          onClose={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
          disablePermanent={false}
        />

        <Typography type="display1" gutterBottom>
          Florida
        </Typography>
        <Typography type="subheading" gutterBottom>
          has 20 million people...
        </Typography>

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

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

Index.childContextTypes = {
  url: PropTypes.object,
  pages: PropTypes.array,
  activePage: PropTypes.object,
};

export default withRoot(withStyles(styles)(Index));
