// TaskCard.tsx
import React, { useState } from 'react';
import './taskCard.css';
import { Badge, Card, Typography } from 'antd';
import { useAppDispatch } from '../../hooks/redux';
import { openTaskModal } from '../../redux/slices/taskModalSlice';
import { Task, TaskPriorityColors } from '../../types';
import { useParams } from 'react-router-dom';

const { Text, Paragraph } = Typography;

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsHovered(true);
    }, 500);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(false);
  };
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(openTaskModal(task.id, false, Number(id)));
  };

  return (
    <Badge.Ribbon
      text={task.priority}
      color={TaskPriorityColors[task.priority]}
      // offset={[10, 10]}
    >
      <Card
        size="small"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="task-card"
        style={{
          marginBottom: 8,
          cursor: isHovered ? 'pointer' : 'grab',
          borderRadius: 4,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
        bodyStyle={{ padding: 12 }}
      >
        <Text
          strong
          style={{ display: 'block', marginBottom: 4, paddingRight: 30 }}
        >
          {task.title}
        </Text>
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ margin: 0, fontSize: 12 }}
        >
          {task.description}
        </Paragraph>
      </Card>
    </Badge.Ribbon>
  );
};

export default TaskCard;
