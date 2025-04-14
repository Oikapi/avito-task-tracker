import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Flex } from 'antd';
import { TaskStatus } from '../../types';
import TaskList from '../../components/TaskList/TaskList';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import {
  boardsGetAllBoards,
  boardsGetBoardById,
  moveTaskOptimistically,
  updateTaskStatus,
} from '../../redux/slices/boardsSlice';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { boardTasksByStatus } = useAppSelector((state) => state.boards);
  const [title, setTitle] = useState('');

  useEffect(() => {
    dispatch(boardsGetAllBoards())
      .unwrap()
      .then((boardsList) => {
        setTitle(
          boardsList.find((board) => board.id === Number(id))?.name ||
            'Доска не найдена'
        );
      });
  }, [id]);

  useEffect(() => {
    dispatch(boardsGetBoardById(Number(id)));
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    console.log(draggableId);
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = Object.keys(boardTasksByStatus)[
      parseInt(source.droppableId)
    ] as TaskStatus;

    const destinationStatus = Object.keys(boardTasksByStatus)[
      parseInt(destination.droppableId)
    ] as TaskStatus;

    dispatch(
      moveTaskOptimistically({
        taskId: Number(draggableId),
        sourceStatus,
        sourceIndex: source.index,
        destinationStatus,
        destinationIndex: destination.index,
      })
    );

    dispatch(
      updateTaskStatus({
        taskId: Number(draggableId),
        newStatus: destinationStatus,
      })
    )
      .unwrap()
      .catch(() => {
        dispatch(
          moveTaskOptimistically({
            taskId: Number(draggableId),
            sourceStatus: destinationStatus,
            sourceIndex: destination.index,
            destinationStatus: sourceStatus,
            destinationIndex: source.index,
          })
        );
      });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Title level={2}>{title}</Title>
      <Flex gap={15}>
        {Object.entries(boardTasksByStatus).map(([status, tasks], index) => (
          <TaskList
            key={status}
            droppableId={index.toString()}
            status={status as TaskStatus}
            tasks={tasks}
          />
        ))}
      </Flex>
    </DragDropContext>
  );
};

export default BoardPage;
