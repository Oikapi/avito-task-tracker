import { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#595959', // Основной серый
    colorBgBase: '#f5f5f5', // Фон
    colorTextBase: '#262626', // Основной текст
    colorBorder: '#d9d9d9', // Границы
    colorBgContainer: '#ffffff', // Фон компонентов
    colorBgLayout: '#f0f0f0', // Фон макета
    colorTextSecondary: '#8c8c8c', // Вторичный текст
    colorFillSecondary: '#f0f0f0', // Вторичный фон
  },
  components: {
    Button: {
      colorPrimary: '#434343',
      colorPrimaryHover: '#262626',
      colorPrimaryActive: '#1f1f1f',
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: '#e8e8e8',
    },
    Table: {
      colorBgContainer: '#ffffff',
      colorFillAlter: '#fafafa',
    },
    Notification: {
      zIndexPopup: 10000,
      colorBgElevated: '#ffffff',
      colorText: 'rgba(0, 0, 0, 0.88)',
    },
  },
};

export default themeConfig;
