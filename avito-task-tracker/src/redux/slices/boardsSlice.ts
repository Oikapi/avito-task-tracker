import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ApiError,
  ApiMessage,
  ApiResponse,
  Board,
  Task,
  TaskStatus,
} from '../../types';
import axiosInstance from '../../api';
import axios, { AxiosError } from 'axios';
import { Notifications } from '../../utils/notifications';

export const boardsGetAllBoards = createAsyncThunk<
  Board[],
  undefined,
  { rejectValue: ApiError }
>('boards/getAllBoards', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Board[]>>(`/boards`);
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

export const boardsGetBoardById = createAsyncThunk<
  Task[],
  number,
  { rejectValue: ApiError }
>('boards/getBoardById', async (boardId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Task[]>>(
      `boards/${Number(boardId)}`
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

export const updateTaskStatus = createAsyncThunk<
  ApiMessage & { taskId: number; newStatus: TaskStatus },
  { taskId: number; newStatus: TaskStatus },
  { rejectValue: ApiError }
>(
  'boards/updateTaskStatus',
  async ({ taskId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<ApiResponse<ApiMessage>>(
        `/tasks/updateStatus/${taskId}`,
        {
          status: newStatus,
        }
      );
      return {
        message: response.data.data.message,
        taskId: taskId,
        newStatus: newStatus,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ApiError>;
        if (error.response) {
          Notifications.error(
            'Обновление статуса задачи',
            error.response.data.message
          );
          return rejectWithValue(error.response.data);
        }
        Notifications.error(
          'Обновление статуса задачи',
          'Ошибка сети или сервера'
        );
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
  }
);

interface TaskModalState {
  boardsList: Board[];
  boardsListLoading: boolean;
  boardsListError: ApiError | null;

  boardTasksByStatus: Record<TaskStatus, Task[]>;
  boardLoading: boolean;
  boardError: ApiError | null;

  taskUpdateStatusLoading: boolean;
  taskUpdateStatusError: ApiError | null;
}

const initialState: TaskModalState = {
  boardsList: [],
  boardsListLoading: false,
  boardsListError: null,

  boardLoading: false,
  boardTasksByStatus: {
    Backlog: [],
    InProgress: [],
    Done: [],
  },
  boardError: null,

  taskUpdateStatusLoading: false,
  taskUpdateStatusError: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    moveTaskOptimistically: (
      state,
      action: PayloadAction<{
        taskId: number;
        sourceStatus: TaskStatus;
        sourceIndex: number;
        destinationStatus: TaskStatus;
        destinationIndex: number;
      }>
    ) => {
      const { sourceStatus, sourceIndex, destinationStatus, destinationIndex } =
        action.payload;

      const task = state.boardTasksByStatus[sourceStatus][sourceIndex];

      state.boardTasksByStatus[sourceStatus] = state.boardTasksByStatus[
        sourceStatus
      ].filter((_, index) => index !== sourceIndex);

      state.boardTasksByStatus[destinationStatus].splice(destinationIndex, 0, {
        ...task,
        status: destinationStatus,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(boardsGetAllBoards.pending, (state) => {
        state.boardsListLoading = true;
        state.boardsListError = null;
      })
      .addCase(boardsGetAllBoards.fulfilled, (state, action) => {
        state.boardsListLoading = false;
        state.boardsList = action.payload;
      })
      .addCase(boardsGetAllBoards.rejected, (state, action) => {
        state.boardsListLoading = false;
        state.boardsListError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      })

      .addCase(boardsGetBoardById.pending, (state) => {
        state.boardLoading = true;
        state.boardError = null;
      })
      .addCase(boardsGetBoardById.fulfilled, (state, action) => {
        state.boardLoading = false;
        const tempTaskByStatus: Record<TaskStatus, Task[]> = {
          Backlog: [],
          InProgress: [],
          Done: [],
        };
        action.payload.forEach((task) => {
          tempTaskByStatus[task.status].push(task);
        });
        state.boardTasksByStatus = tempTaskByStatus;
      })
      .addCase(boardsGetBoardById.rejected, (state, action) => {
        state.boardLoading = false;
        state.boardError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      })

      .addCase(updateTaskStatus.pending, (state) => {
        state.taskUpdateStatusLoading = true;
        state.taskUpdateStatusError = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state) => {
        state.taskUpdateStatusLoading = false;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.taskUpdateStatusLoading = false;
        state.taskUpdateStatusError = action.payload ?? {
          error: 'unknown_error',
          message: 'Не удалось обновить статус',
        };
      });
  },
});

export const { moveTaskOptimistically } = boardsSlice.actions;
export default boardsSlice.reducer;
