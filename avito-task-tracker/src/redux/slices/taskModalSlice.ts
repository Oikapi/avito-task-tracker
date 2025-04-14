import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiError, ApiResponse, Board, Task, UserProfile } from '../../types';
import axiosInstance from '../../api';
import axios, { AxiosError } from 'axios';

export const taskModalGetUsers = createAsyncThunk<
  UserProfile[],
  undefined,
  { rejectValue: ApiError }
>('taskModal/getUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserProfile[]>>(
      `/users`
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

export const taskModalGetBoards = createAsyncThunk<
  Board[],
  undefined,
  { rejectValue: ApiError }
>('taskModal/getBoards', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Board[]>>('/boards');
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

export const taskModalGetTaskById = createAsyncThunk<
  Task,
  number,
  { rejectValue: ApiError }
>('taskModal/getTaskById', async (taskId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Task>>(
      `/tasks/${taskId}`
    );
    return response.data.data;
  } catch (err) {
    ``;
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

interface TaskModalState {
  currentTaskId: number | null;
  currentTask: Task | null;
  currentTaskLoading: boolean;
  mainError: ApiError | null;
  isModalOpen: boolean;
  isShowToProjectButton: boolean;
  boardId: number | null;

  boardOptions: Board[];
  boardsLoading: boolean;
  boardsError: ApiError | null;

  userOptions: UserProfile[];
  usersLoading: boolean;
  usersError: ApiError | null;
}

const initialState: TaskModalState = {
  currentTaskId: null,
  currentTask: null,
  currentTaskLoading: false,
  mainError: null,
  isModalOpen: false,
  isShowToProjectButton: false,
  boardId: null,

  boardOptions: [],
  boardsLoading: false,
  boardsError: null,

  userOptions: [],
  usersLoading: false,
  usersError: null,
};

const taskModalSlice = createSlice({
  name: 'taskModal',
  initialState,
  reducers: {
    openTaskModal: {
      prepare(
        taskId: number | null,
        showProjectButton?: boolean,
        boardId?: number | null
      ) {
        return {
          payload: {
            taskId,
            showProjectButton: showProjectButton || false,
            boardId: boardId || null,
          },
        };
      },
      reducer(
        state,
        action: PayloadAction<{
          taskId: number | null;
          showProjectButton: boolean;
          boardId: number | null;
        }>
      ) {
        state.isModalOpen = true;
        state.currentTaskId = action.payload.taskId;
        if (state.currentTask && !action.payload.taskId) {
          state.currentTask = null;
        }
        state.isShowToProjectButton = action.payload.showProjectButton;
        state.boardId = action.payload.boardId;
      },
    },
    closeTaskModal(state) {
      state.isModalOpen = false;
      state.currentTaskId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskModalGetUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(taskModalGetUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.userOptions = action.payload;
      })
      .addCase(taskModalGetUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      })

      .addCase(taskModalGetBoards.pending, (state) => {
        state.boardsLoading = true;
        state.boardsError = null;
      })
      .addCase(taskModalGetBoards.fulfilled, (state, action) => {
        state.boardsLoading = false;
        state.boardOptions = action.payload;
      })
      .addCase(taskModalGetBoards.rejected, (state, action) => {
        state.boardsLoading = false;
        state.boardsError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      })

      .addCase(taskModalGetTaskById.pending, (state) => {
        state.currentTaskLoading = true;
        state.mainError = null;
      })
      .addCase(taskModalGetTaskById.fulfilled, (state, action) => {
        state.currentTaskLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(taskModalGetTaskById.rejected, (state, action) => {
        state.currentTaskLoading = false;
        state.mainError = action.payload ?? {
          error: 'unknown_error',
          message: 'Неизвестная ошибка',
        };
      });
  },
});

export const { closeTaskModal, openTaskModal } = taskModalSlice.actions;
export default taskModalSlice.reducer;
