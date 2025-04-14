import React, { useState, useEffect } from 'react';
import { Input, Button, Card, List, Flex } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskStatus, TaskWithBoard } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { tasksGetAllTask } from '../../redux/slices/tasksSlice';
import { boardsGetAllBoards } from '../../redux/slices/boardsSlice';
import {
  openTaskModal,
  taskModalGetUsers,
} from '../../redux/slices/taskModalSlice';
import TaskFiltersDrawer from '../../components/TaskFiltersDrawer/TaskFiltersDrawer';

const TaskListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasksList } = useAppSelector((state) => state.tasks);

  const [filteredTasks, setFilteredTasks] =
    useState<TaskWithBoard[]>(tasksList);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [boardFilter, setBoardFilter] = useState<number | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<number | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(tasksGetAllTask());
    dispatch(boardsGetAllBoards());
    dispatch(taskModalGetUsers());
  }, []);

  useEffect(() => {
    let result = [...tasksList];

    if (searchText) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }
    if (boardFilter) {
      result = result.filter((task) => task.boardId === boardFilter);
    }

    if (assigneeFilter) {
      result = result.filter((task) => task.assignee?.id === assigneeFilter);
    }

    setFilteredTasks(result);
  }, [tasksList, searchText, statusFilter, boardFilter, assigneeFilter]);

  const onTaskClickHandler = (id: number, boardId: number) => {
    dispatch(openTaskModal(id, true, boardId));
  };

  const handlerOpenModal = () => {
    dispatch(openTaskModal(null, false, null));
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Flex justify="space-between" wrap>
          <Input
            placeholder="Поиск по названию"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />

          <Button onClick={() => setIsFilterDrawerOpen(true)}>Фильтры</Button>
        </Flex>
      </div>

      <List
        pagination={{ pageSize: 10 }}
        dataSource={filteredTasks}
        className="task-list"
        footer={
          <Flex>
            <Button
              style={{
                fontSize: 16,
                marginLeft: 'auto',
              }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={handlerOpenModal}
            >
              Создать задачу
            </Button>
          </Flex>
        }
        renderItem={(task) => (
          <Card
            key={task.id}
            onClick={() => onTaskClickHandler(task.id, task.boardId)}
            style={{
              marginBottom: 16,
              borderRadius: 8,
              cursor: 'pointer',
            }}
            hoverable
          >
            <div style={{ color: '#262626', fontSize: 14 }}>{task.title}</div>
          </Card>
        )}
      />

      <TaskFiltersDrawer
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        boardFilter={boardFilter}
        setBoardFilter={setBoardFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
      />
    </>
  );
};

export default TaskListPage;
