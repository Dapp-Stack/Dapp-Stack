import React from "react";
import { Site, Nav, Grid, List, Button } from "tabler-react";

import './Layout.css'

const Layout = (props) => (
  <Site.Wrapper
    headerProps={{
      href: "/",
      alt: "Solon Project",
      navItems: (
        <Nav.Item type="div" className="d-none d-md-flex">

        </Nav.Item>
      )
    }}
    footerProps={{
      nav: (
        <React.Fragment>
          <Grid.Col auto={true}>
            <List className="list-inline list-inline-dots mb-0">
              <List.Item className="list-inline-item">
                <a href="./docs/index.html">Documentation</a>
              </List.Item>
              <List.Item className="list-inline-item">
                <a href="./faq.html">FAQ</a>
              </List.Item>
            </List>
          </Grid.Col>
          <Grid.Col auto={true}>
            <Button
              href="https://github.com/tabler/tabler-react"
              size="sm"
              outline
              color="primary"
              RootComponent="a"
            >
              Github
            </Button>
          </Grid.Col>
        </React.Fragment>
      ),
    }}
  >
    {props.children}
  </Site.Wrapper>
);

export default Layout;
