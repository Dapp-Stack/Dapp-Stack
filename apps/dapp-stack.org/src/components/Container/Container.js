import React from 'react';

import {media} from 'theme';

import type {Node} from 'react';

const Container = ({children}: {children: Node}) => (
  <div
    css={{
      paddingLeft: 20,
      paddingRight: 20,
      marginLeft: 'auto',
      marginRight: 'auto',

      [media.greaterThan('medium')]: {
        width: '90%',
      },

      [media.size('xxlarge')]: {
        maxWidth: 1260,
      },
    }}>
    {children}
  </div>
);

export default Container;
