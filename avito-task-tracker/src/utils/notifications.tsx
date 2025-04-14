import { notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

const showNotification = (
  type: NotificationType,
  message: string,
  description?: string,
  duration?: number
) => {
  const icons = {
    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    warning: <WarningOutlined style={{ color: '#faad14' }} />,
  };

  notification[type]({
    message,
    description,
    icon: icons[type],
    placement: 'bottomLeft',
    duration: duration || (type === 'error' ? 6 : 4.5),
  });
};

export const Notifications = {
  success: (message: string, desc?: string) =>
    showNotification('success', message, desc),
  error: (message: string, desc?: string) =>
    showNotification('error', message, desc),
  info: (message: string, desc?: string) =>
    showNotification('info', message, desc),
  warning: (message: string, desc?: string) =>
    showNotification('warning', message, desc),
};
