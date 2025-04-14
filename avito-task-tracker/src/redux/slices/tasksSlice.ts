import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ApiError,
  ApiMessage,
  ApiResponse,
  TaskToCreate,
  TaskWithBoard,
} from '../../types';
import axiosInstance from '../../api';
import axios, { AxiosError } from 'axios';
import { Notifications } from '../../utils/notifications';

export const tasksGetAllTask = createAsyncThunk<
  TaskWithBoard[],
  undefined,
  { rejectValue: ApiError }
>('tasks/getAllTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<TaskWithBoard[]>>(
      `/tasks`
    );
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const error = err as AxiosError<ApiError>;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: 'network_error',
        message: 'Ошибка сети или сервера',
      });
    }
    return rejectWithValue({
      error: 'unknown_error',
      message: 'Произошла неизвестная ошибка',
    });
  }
});

export const tasksCreateTask = createAsyncThunk<
  { id: number },
  TaskToCreate,
  { rejectValue: ApiError }
>('tasks/createTask', async (task, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ id: number }>>(
      `/tasks/create`,
      task
    );

    Notifications.success('Создание задачи', 'Задача успешно создана');
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const error = err as AxiosError<ApiError>;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: 'network_error',
        message: 'Ошибка сети или сервера',
      });
    }
    return rejectWithValue({
      error: 'unknown_error',
      message: 'Произошла неизвестная ошибка',
    });
  }
});

export const tasksUpdateTask = createAsyncThunk<
  ApiMessage,
  TaskToCreate & { id: number },
  { rejectValue: ApiError }
>('tasks/updateTask', async (task, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ApiResponse<ApiMessage>>(
      `/tasks/update/${task.id}`,
      task
    );
    Notifications.success('Редактирование задачи', response.data.data.message);
    return response.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const error = err as AxiosError<ApiError>;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        error: 'network_error',
        message: 'Ошибка сети или сервера',
      });
    }
    return rejectWithValue({
      error: 'unknown_error',
      message: 'Произошла неизвестная ошибка',
    });
  }
});

interface TasksState {
  tasksList: TaskWithBoard[];
  taskListLoading: boolean;
  taskListError: ApiError | null;

  taskUpdateLoading: boolean;
  taskUpdateError: ApiError | null;
}

const initialState: TasksState = {
  tasksList: [],
  taskListLoading: false,
  taskListError: null,

  taskUpdateLoading: false,
  taskUpdateError: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(tasksGetAllTask.pending, (state) => {
        state.taskListLoading = true;
        state.taskListError = null;
      })
      .addCase(tasksGetAllTask.fulfilled, (state, action) => {
        state.taskListLoading = false;
        state.tasksList = action.payload;
      })
      .addCase(tasksGetAllTask.rejected, (state, action) => {
        state.taskListLoading = false;
        state.taskListError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      })

      .addCase(tasksUpdateTask.pending, (state) => {
        state.taskUpdateLoading = true;
        state.taskUpdateError = null;
      })
      .addCase(tasksUpdateTask.fulfilled, (state) => {
        state.taskUpdateLoading = false;
      })
      .addCase(tasksUpdateTask.rejected, (state, action) => {
        state.taskListLoading = false;
        state.taskUpdateError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      });
  },
});

export const {} = tasksSlice.actions;
export default tasksSlice.reducer;
