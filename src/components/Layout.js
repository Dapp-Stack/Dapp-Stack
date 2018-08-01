import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
// import Menu from "@material-ui/icons/Menu";
// core components
// import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";



class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.headerColorChange = this.headerColorChange.bind(this);
  }
  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }
  componentDidMount() {
    if (this.props.changeColorOnScroll) {
      window.addEventListener("scroll", this.headerColorChange);
    }
  }
  headerColorChange() {
    // const { classes, color, changeColorOnScroll } = this.props;
    // const windowsScrollTop = window.pageYOffset;
    // if (windowsScrollTop > changeColorOnScroll.height) {
    //   document.body
    //     .getElementsByTagName("header")[0]
    //     .classList.remove(classes[color]);
    //   document.body
    //     .getElementsByTagName("header")[0]
    //     .classList.add(classes[changeColorOnScroll.color]);
    // } else {
    //   document.body
    //     .getElementsByTagName("header")[0]
    //     .classList.add(classes[color]);
    //   document.body
    //     .getElementsByTagName("header")[0]
    //     .classList.remove(classes[changeColorOnScroll.color]);
    // }
  }
  componentWillUnmount() {
    if (this.props.changeColorOnScroll) {
      window.removeEventListener("scroll", this.headerColorChange);
    }
  }
  render() {
    const {
      classes,
      color,
      rightLinks,
      leftLinks,
      brand,
      fixed,
      absolute
    } = this.props;
    const appBarClasses = classNames({

    });
    const brandComponent = (
      <Button>
        {brand}
      </Button>
    );
    return (
      <AppBar>
        <Toolbar>
          {leftLinks !== undefined ? brandComponent : null}
          <div>
            {leftLinks !== undefined ? (
              <Hidden smDown implementation="css">
                {leftLinks}
              </Hidden>
            ) : (
              brandComponent
            )}
          </div>
          <Hidden smDown implementation="css">
            {rightLinks}
          </Hidden>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              {/*<Menu />*/}
            </IconButton>
          </Hidden>
        </Toolbar>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"right"}
            open={this.state.mobileOpen}
            classes={{
            }}
            onClose={this.handleDrawerToggle}
          >
            <div>
              {leftLinks}
              {rightLinks}
            </div>
          </Drawer>
        </Hidden>
      </AppBar>
    );
  }
}

export default Layout;
