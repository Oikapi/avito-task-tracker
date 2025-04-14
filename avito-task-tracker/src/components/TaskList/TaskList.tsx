import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Typography, Space } from 'antd';
import TaskCard from '../TaskCard/TaskCard';
import { Task } from '../../types';

const { Text } = Typography;

interface TaskListProps {
  droppableId: string;
  status: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ droppableId, status, tasks }) => {
  return (
    <Card
      style={{
        backgroundColor: '#fafafa',
        border: '1px solid #f0f0f0',
        boxShadow: 'none',
        width: '100%',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Text strong style={{ display: 'block', marginBottom: 16 }}>
        {status}
      </Text>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: '40px',
              backgroundColor: snapshot.isDraggingOver
                ? '#f0f9ff'
                : 'transparent',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
            </Space>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
};

export default TaskList;
