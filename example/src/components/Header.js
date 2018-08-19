import React from "react";
import {
  Dropdown,
  Menu,
  Button, Icon,
} from 'semantic-ui-react'

const Header = ({toggleSidebar}) => (
  <Menu attached='top' icon='labeled'>
    <Menu.Item header name='gamepad'>
      <Icon name='gamepad' />
      Solon
    </Menu.Item>

    <Menu.Item name='video camera'>
      <Icon name='video camera' />
      View
    </Menu.Item>

    <Menu.Item name='video play'>
      <Icon name='video play' />
      Register a Structure
    </Menu.Item>

    <Menu.Menu position='right'>
      <Menu.Item onClick={toggleSidebar} link>
        <Icon name='dot circle' />
        Hello
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

export default Header;
