import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index.tsx';
import './style.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import themeConfig from './theme/themeConfig.ts';
import { ConfigProvider, App as AntApp } from 'antd';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={themeConfig}>
    <Provider store={store}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </Provider>
  </ConfigProvider>
);
