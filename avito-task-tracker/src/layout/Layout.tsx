import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import TaskModal from '../components/TaskModal/TaskModal';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />

      <Content style={{ padding: '24px' }}>
        <div
          style={{
            minHeight: 'calc(100vh - 64px - 48px)',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
            padding: '0px 100px 0px 100px',
          }}
        >
          <Outlet />
        </div>
      </Content>

      <TaskModal />
    </AntLayout>
  );
};

export default Layout;
