// // authSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { RootState } from '../store/store';
// import axios from 'axios';


// interface AuthState {
//     user: any; // Modify this type to match your user object structure
//     error: string | null;
//     isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//     user: null,
//     error: null,
//     isAuthenticated: false,
// };

// // export const login = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }) => {
// //     const { email, password } = credentials;
// //     return signIn(email, password);
// // });

// // export const login = createAsyncThunk(
// //   'auth/login',
// //   async (credentials: { email: string; password: string }) => {
// //     const { email, password } = credentials;
    
// //     console.log("HERE")

// //     if (!email) {
// //       throw new Error('Email is required.');
// //     }
    
// //     return signIn(email, password);
// //   }
// // );

// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials: { username: string; password: string }) => {

//     try {
//       const userLogin = await axios.post(`/auth/login`, credentials);
//       console.log(userLogin)
//       return await userLogin.data;  
//     } catch (error:any) {
//       console.log(error)
//       throw new Error(error.message);
//     }
//   }
// );

// export const registerUser = createAsyncThunk('auth/register', async(values: any) => {
//   try {
//     const userRegister = await axios.post(`/auth/register`, values);    
//     return await userRegister.data;     
//   } catch (error: any) {
//     throw new Error(error);
//   }
// })


// export const logout = createAsyncThunk('auth/logout', async () => {
//   try {
//     await axios.post('/auth/logout');
//   } catch (error:any) {
//     throw new Error(error.message);
//   }
// });

// export const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//       builder
//         .addCase(login.fulfilled, (state, action) => {
//           state.users = action.payload;
//           state.error = null;
//           state.isAuthenticated = true;
//         })
//         .addCase(login.rejected, (state, action) => {
//           console.log(action, "rejeccted")
//           state.users = null;
//           state.error = action.error.message || 'Login failed';
//           state.isAuthenticated = false;
//         })
//         .addCase(registerUser.fulfilled, (state, action) => {
//           console.log(action,  "fulfilled")
//           state.users = action.payload;
//           state.isAuthenticated = false;
//           state.error = null;
//         })
//         .addCase(registerUser.rejected, (state, action) => {
//           console.log(action, "rejectied")
//           state.users = null;
//           state.isAuthenticated = false;
//           state.error = action.error.message || 'Login Failed';
//         })
//         .addCase(logout.fulfilled, (state) => {
//           state.users = null;
//           state.error = null;
//           state.isAuthenticated = false;
//         })
//         .addCase(logout.rejected, (state, action) => {
//           state.error = action.error.message || 'Logout failed';
//         })
        
//     },
// });

// // Other code such as selectors can use the imported `RootState` type
// export const AuthUser = (state: RootState) => state.auth.user;
// export const AuthError = (state: RootState) => state.auth.error;
// export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;
  
// export default authSlice.reducer;


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import axios from 'axios';

interface AuthState {
  users: any; // Modify this type to match your user object structure
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userRecord: any
}

const initialState: AuthState = {
  users: [],
  error: null,
  isAuthenticated: false,
  userRole: '',
  userRecord: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    try {
      const userLogin = await axios.post(`/auth/login`, credentials);
      return await userLogin.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (values: any) => {
    try {
      const userRegister = await axios.post(`/auth/register`, values);
      return await userRegister.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.post('/auth/logout');
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId: string) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async () => {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload, "payload")
        state.users = action.payload;
        state.error = null;
        state.isAuthenticated = true;
        state.userRole = action.payload.user.is_staff ? 'staff' : 'user';
        state.userRecord = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.users = null;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
        state.userRole = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isAuthenticated = false;
        state.error = null;
        state.userRole = action.payload.user.is_staff ? 'staff' : 'user';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.users = null;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Registration Failed';
        state.userRole = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.users = null;
        state.error = null;
        state.isAuthenticated = false;
        state.userRole = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.error = null;
        state.userRecord = action.payload; // Update userRecord field
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to get user';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to get users';
      });
  },
});

export const AuthUser = (state: RootState) => state.auth.users;
export const AuthError = (state: RootState) => state.auth.error;
export const isAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.userRole;
export const selectuserRecord = (state: RootState) => state.auth.userRecord;

export default authSlice.reducer;
