// authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import axios from 'axios';


interface AuthState {
    user: any; // Modify this type to match your user object structure
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    error: null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
};

// export const login = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }) => {
//     const { email, password } = credentials;
//     return signIn(email, password);
// });

// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials: { email: string; password: string }) => {
//     const { email, password } = credentials;
    
//     console.log("HERE")

//     if (!email) {
//       throw new Error('Email is required.');
//     }
    
//     return signIn(email, password);
//   }
// );

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;

    if (!email) {
      throw new Error('Email is required.');
    }

    try {
      const userLogin = await axios.post(`/auth/login`, {email, password});
      return await userLogin.data;  
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
);

export const register = createAsyncThunk('auth/register', async(values) => {
  const userRegister = await axios.post(`/auth/register`, values);
  return await userRegister.data; 
})


export const logout = createAsyncThunk('auth/logout', async () => {
  const userLogout = await axios.post(`/user/logout`);
  return await userLogout.data; 
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(login.fulfilled, (state, action) => {
          state.user = action.payload;
          state.error = null;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          console.log(action.error.message, "rejeccted")
          state.user = null;
          state.error = action.error.message || 'Login failed';
          state.isAuthenticated = false;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = false;
          state.error = null;
        })
        .addCase(register.rejected, (state, action) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.error.message || 'Login Failed';
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
          state.error = null;
          state.isAuthenticated = false
        });
    },
});

// Other code such as selectors can use the imported `RootState` type
export const AuthUser = (state: RootState) => state.auth.user;
export const AuthError = (state: RootState) => state.auth.error;
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;
  
export default authSlice.reducer;
