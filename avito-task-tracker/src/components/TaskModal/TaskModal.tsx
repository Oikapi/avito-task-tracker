import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin, Avatar, Flex } from 'antd';
import {
  TaskPriority,
  TaskStatus,
  TaskPriorityLabels,
  TaskStatusLabels,
  TaskToCreate,
} from '../../types';
import {
  closeTaskModal,
  taskModalGetBoards,
  taskModalGetTaskById,
  taskModalGetUsers,
} from '../../redux/slices/taskModalSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  tasksCreateTask,
  tasksGetAllTask,
  tasksUpdateTask,
} from '../../redux/slices/tasksSlice';
import { Notifications } from '../../utils/notifications';
import { boardsGetBoardById } from '../../redux/slices/boardsSlice';

const { Option } = Select;
const { TextArea } = Input;

const TaskModal: React.FC = () => {
  const [form] = Form.useForm<TaskToCreate>();
  const dispatch = useAppDispatch();

  const {
    isModalOpen,
    currentTaskId,
    currentTask,
    userOptions,
    isShowToProjectButton,
    boardId,
    boardOptions,
    boardsLoading,
  } = useAppSelector((state) => state.taskModal);

  const location = useLocation();

  const { taskUpdateLoading } = useAppSelector((state) => state.tasks);
  const [isBoardSelectActive, setIsBoardSelectActive] = useState<boolean>(true);
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    dispatch(taskModalGetBoards());
    dispatch(taskModalGetUsers());
  }, []);

  useEffect(() => {
    if (currentTaskId) {
      dispatch(taskModalGetTaskById(currentTaskId));
    } else {
      form.resetFields();
    }
  }, [currentTaskId]);

  useEffect(() => {
    console.log(boardId || undefined);
    if (currentTask) {
      setIsBoardSelectActive(false);
      form.setFieldsValue({
        title: currentTask.title,
        description: currentTask.description,
        boardId: boardId || undefined,
        priority: currentTask.priority,
        status: currentTask.status,
        assigneeId: currentTask.assignee.id,
      });
    } else if (boardId) {
      form.resetFields();
      setIsBoardSelectActive(false);
      form.setFieldValue('boardId', boardId);
    } else {
      setIsBoardSelectActive(true);
      form.resetFields();
    }
  }, [currentTask, form, boardId]);

  console.log(form.getFieldValue('boardId'));

  const handleSave = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();

      const newTask: TaskToCreate = {
        assigneeId: values.assigneeId,
        boardId: values.boardId,
        description: values.description,
        priority: values.priority,
        title: values.title,
        status: values.status,
      };

      if (currentTask) {
        dispatch(
          tasksUpdateTask({
            ...newTask,
            id: currentTask.id,
            status: values.status,
          })
        )
          .unwrap()
          .then(() => {
            if (location.pathname.startsWith('/issues')) {
              dispatch(tasksGetAllTask());
            } else {
              dispatch(boardsGetBoardById(Number(boardId)));
            }
          });
      } else {
        dispatch(tasksCreateTask(newTask))
          .unwrap()
          .then(() => {
            if (location.pathname.startsWith('/issues')) {
              dispatch(tasksGetAllTask());
            } else {
              dispatch(boardsGetBoardById(Number(boardId)));
            }
          });
      }
      form.resetFields();
      dispatch(closeTaskModal());
    } catch (error) {
      Notifications.error('Сохранение задачи', 'Ошибка при сохранении задачи');
    } finally {
      setConfirmLoading(false);
    }
  };

  const onClose = () => {
    dispatch(closeTaskModal());
  };

  const isEditMode = Boolean(currentTask);

  return (
    <Modal
      title={isEditMode ? 'Редактировать задачу' : 'Создать задачу'}
      open={isModalOpen}
      onCancel={onClose}
      footer={(_) => (
        <Flex justify="space-between">
          {isShowToProjectButton && (
            <Button
              key="goToBoard"
              type="link"
              onClick={() => navigate(`board/${boardId}`)}
            >
              Перейти на доску
            </Button>
          )}
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleSave}
            style={{ marginLeft: 'auto' }}
          >
            {isEditMode ? 'Сохранить' : 'Создать'}
          </Button>
        </Flex>
      )}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Пожалуйста, введите название' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="boardId"
          label="Проект"
          rules={[{ required: true, message: 'Пожалуйста, выберите проект' }]}
        >
          <Select
            disabled={!isBoardSelectActive}
            loading={boardsLoading}
            notFoundContent={boardsLoading ? <Spin size="small" /> : null}
          >
            {boardOptions.map((board) => (
              <Option key={board.id} value={board.id}>
                {board.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Приоритет"
          rules={[
            { required: true, message: 'Пожалуйста, выберите приоритет' },
          ]}
        >
          <Select>
            {Object.values(TaskPriority).map((priorityValue) => (
              <Option key={priorityValue} value={priorityValue}>
                {TaskPriorityLabels[priorityValue]}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Статус"
          rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}
        >
          <Select>
            {Object.values(TaskStatus).map((statusValue) => (
              <Option key={statusValue} value={statusValue}>
                {TaskStatusLabels[statusValue]}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="assigneeId" label="Исполнитель">
          <Select
            style={{
              width: '100%',
              height: 40,
              fontSize: 16,
            }}
          >
            {userOptions.map((user) => (
              <Option key={user.id} value={user.id}>
                <Avatar
                  src={user.avatarUrl}
                  size={30}
                  style={{ marginRight: 8 }}
                />
                {user.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      {taskUpdateLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            borderRadius: 20,
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
