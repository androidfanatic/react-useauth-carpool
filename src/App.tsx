import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Auth from 'src/auth';
import Routes from 'src/routes/Routes';
import store from 'src/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Auth>
          <Routes />
        </Auth>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
