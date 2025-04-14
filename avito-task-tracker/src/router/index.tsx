import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import BoardsPage from '../pages/BoardsPage/BoardsPage';
import BoardPage from '../pages/BoardPage/BoardPage';
import TaskListPage from '../pages/TasksPage/TaskPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <BoardsPage /> },
      { path: '/boards', element: <BoardsPage /> },
      { path: '/board/:id', element: <BoardPage /> },
      { path: '/issues', element: <TaskListPage /> },
    ],
  },
]);
