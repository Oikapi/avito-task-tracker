import React from 'react';
import { TaskStatus, TaskStatusLabels } from '../../types';
import { Button, Drawer, Select, Space } from 'antd';
import { useAppSelector } from '../../hooks/redux';

const { Option } = Select;

interface TaskFiltersDrawerProps {
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (isOpen: boolean) => void;
  statusFilter: TaskStatus | null;
  setStatusFilter: (status: TaskStatus | null) => void;
  boardFilter: number | null;
  setBoardFilter: (boardId: number | null) => void;
  assigneeFilter: number | null;
  setAssigneeFilter: (userId: number | null) => void;
}

const TaskFiltersDrawer: React.FC<TaskFiltersDrawerProps> = ({
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  statusFilter,
  setStatusFilter,
  boardFilter,
  setBoardFilter,
  assigneeFilter,
  setAssigneeFilter,
}) => {
  const boardsList = useAppSelector((state) => state.boards.boardsList);
  const assigneeOptions = useAppSelector(
    (state) => state.taskModal.userOptions
  );

  const onClearFilters = () => {
    setStatusFilter(null);
    setBoardFilter(null);
    setAssigneeFilter(null);
  };

  return (
    <Drawer
      title="Фильтры задач"
      placement="right"
      width={350}
      onClose={() => setIsFilterDrawerOpen(false)}
      open={isFilterDrawerOpen}
      bodyStyle={{ backgroundColor: '#f5f5f5' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <h4>Статус задачи</h4>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите статус"
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
          >
            {Object.values(TaskStatus).map((statusValue) => (
              <Option key={statusValue} value={statusValue}>
                {TaskStatusLabels[statusValue]}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <h4>Доска</h4>
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите доску"
            allowClear
            value={boardFilter}
            onChange={setBoardFilter}
          >
            {boardsList.map((board) => (
              <Option key={board.id} value={board.id}>
                {board.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <h4>Исполнитель</h4>
          <Select
            placeholder="Выберите исполнителя"
            style={{ width: '100%' }}
            allowClear
            value={assigneeFilter}
            onChange={setAssigneeFilter}
          >
            {assigneeOptions.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.fullName}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          type="default"
          onClick={onClearFilters}
          style={{ width: '100%' }}
        >
          Сбросить фильтры
        </Button>
      </Space>
    </Drawer>
  );
};

export default TaskFiltersDrawer;
