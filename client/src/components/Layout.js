import React from "react";
import {
  Container,
  Header,
} from 'semantic-ui-react'
import MHeader from "./Header";
import MFooter from "./Footer";

const Layout = (props) => (
  <React.Fragment>
    <MHeader />
    <Container text style={{ marginTop: '7em' }}>
      <Header as='h1'>Semantic UI React Fixed Template</Header>
    </Container>
    <MFooter />
  </React.Fragment>
);

export default Layout;
