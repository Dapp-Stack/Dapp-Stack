import React from 'react';
import ReactDOM from 'react-dom';

import "tabler-react/dist/Tabler.css";

import AppContainer from './containers/AppContainer';
import ProviderContainer from "./containers/ProviderContainer";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ProviderContainer>
    <AppContainer />
  </ProviderContainer>,
  document.getElementById('root')
);
registerServiceWorker();
