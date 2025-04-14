import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/redux';
import { openTaskModal } from '../../redux/slices/taskModalSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();

  const isBoardPage = location.pathname.startsWith('/board/');
  const boardId = isBoardPage ? params.id : null;

  const handleOpenModal = () => {
    if (isBoardPage && boardId) {
      dispatch(openTaskModal(null, false, Number(boardId)));
    } else {
      dispatch(openTaskModal(null, false, null));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Space size="middle">
        <NavLink to="/issues">
          {({ isActive }) => (
            <Button
              type={isActive ? 'primary' : 'text'}
              style={{
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#fff' : 'var(--gray-11)',
                fontSize: 16,
              }}
            >
              Все задачи
            </Button>
          )}
        </NavLink>

        <NavLink to="/boards">
          {({ isActive }) => (
            <Button
              type={isActive ? 'primary' : 'text'}
              style={{
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#fff' : 'var(--gray-11)',
                fontSize: 16,
              }}
            >
              Проекты
            </Button>
          )}
        </NavLink>
      </Space>

      <Button
        style={{
          fontSize: 16,
        }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleOpenModal}
      >
        Создать задачу
      </Button>
    </div>
  );
};

export default Header;
