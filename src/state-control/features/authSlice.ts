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
    isAuthenticated: false,
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
  async (credentials: { username: string; password: string }) => {

    try {
      const userLogin = await axios.post(`/auth/login`, credentials);
      console.log(userLogin)
      return await userLogin.data;  
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message);
    }
  }
);

export const registerUser = createAsyncThunk('auth/register', async(values: any) => {
  try {
    const userRegister = await axios.post(`/auth/register`, values);    
    return await userRegister.data;     
  } catch (error: any) {
    throw new Error(error);
  }
})


export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.post('/auth/logout');
  } catch (error:any) {
    throw new Error(error.message);
  }
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
          console.log(action, "rejeccted")
          state.user = null;
          state.error = action.error.message || 'Login failed';
          state.isAuthenticated = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          console.log(action,  "fulfilled")
          state.user = action.payload;
          state.isAuthenticated = false;
          state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
          console.log(action, "rejectied")
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.error.message || 'Login Failed';
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
          state.error = null;
          state.isAuthenticated = false;
        })
        .addCase(logout.rejected, (state, action) => {
          state.error = action.error.message || 'Logout failed';
        })
        
    },
});

// Other code such as selectors can use the imported `RootState` type
export const AuthUser = (state: RootState) => state.auth.user;
export const AuthError = (state: RootState) => state.auth.error;
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;
  
export default authSlice.reducer;
