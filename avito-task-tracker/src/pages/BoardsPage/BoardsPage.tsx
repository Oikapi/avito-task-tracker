import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { boardsGetAllBoards } from '../../redux/slices/boardsSlice';
import { Card, List } from 'antd';

const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const boardsList = useAppSelector((state) => state.boards.boardsList);

  useEffect(() => {
    dispatch(boardsGetAllBoards());
  }, [dispatch]);

  return (
    <>
      <List
        dataSource={boardsList}
        renderItem={(board) => (
          <Card
            hoverable
            onClick={() => navigate(`/board/${board.id}`)}
            style={{
              marginBottom: 16,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <div>{board.name}</div>
          </Card>
        )}
      />
    </>
  );
};

export default BoardsPage;
