import React from "react";
import {
  Container,
  Header,
  Sidebar,
  Segment,
  Menu,
  Icon
} from 'semantic-ui-react'
import MHeader from "../components/Header";
import MFooter from "../components/Footer";

export default class AppLayout extends React.Component {
  state = {visible: false};

  toggleSidebar = () => this.setState({visible: !this.state.visible});

  handleSidebarHide = () => this.setState({visible: false});

  render() {
    const {visible} = this.state;

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          direction='right'
          animation='overlay'
          icon='labeled'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={visible}
          width='thin'
        >
          <Menu.Item as='a'>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={visible}>
          <MHeader toggleSidebar={this.toggleSidebar}/>
          <Container text style={{marginTop: '7em'}}>
            <Header as='h1'>Semantic UI React Fixed Template</Header>
          </Container>
          <MFooter/>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}
