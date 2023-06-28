import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderType } from "../../types/models";
import axios from "axios";
import { RootState, store } from "../store/store";

const BASE_URL = import.meta.env.VITE_API_SERVER_ENDPOINT as string;

const orders: OrderType[] = [];

export const orderRecord: OrderType = {

    id_: "",
    // name: string,
    quantity: "",
    status: "",
    // order_date: Date,
    size: "",
    spicyness: "",
}

const initialState = {
    orders,
    status: "idle",
    orderRecord,
};

//fixed
// export const fetchAllOrders = createAsyncThunk(
//     "orders/index",
//     async (_, { rejectWithValue }) => {
//       try {
//         const token = localStorage.getItem('token');
//         const headers = {'Authorization': `Bearer ${token}`}
//         const state = store.getState()
//         const isAdmin = state.auth.user;
//         const url = isAdmin ? '/orders' : `/users/${state.auth.user.id}/orders`;
//         const response = await axios.get(`/orders`, {headers});
//         return response.data;
//       } catch (error: any) {
//         console.log(error)
//         return rejectWithValue(error.response.data);
//       }
//     }
// );
export const fetchAllOrders = createAsyncThunk(
    "orders/index",
    async (userId: string | null, { rejectWithValue }) => {
      const token = localStorage.getItem('token');
      const headers = {'Authorization': `Bearer ${token}`}
      try {
        if (userId) {
          const response = await axios.get(`/users/${userId}/orders`, {headers});
          return response.data;
        } else {
          const response = await axios.get('/orders', {headers});
          return response.data;
        }
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
});



// fixed
export const createOrder = createAsyncThunk(
    "orders/store",
    async (order: OrderType, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const headers = {'Authorization': `Bearer ${token}`}
        const response = await axios.post<OrderType>(`/orders/order`, order, {headers});
        return response.data;
      } catch (error:any) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const fetchOrderById = createAsyncThunk(
    "orders/show",
    async (orderId: string, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const headers = {'Authorization': `Bearer ${token}`}
        const response = await axios.get(`order/${orderId}`, {headers});
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

export const updateOrder = createAsyncThunk(
    "orders/update",
    async (order: OrderType, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const headers = {'Authorization': `Bearer ${token}`}
        const response = await axios.patch(
          `order/update/${order.id_}`,
          order, {headers}
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const deleteOrder = createAsyncThunk('faculty/delete', async (id: string) => {       
  const deleteResponse = await axios.delete(`order/${id}`);
  return await deleteResponse.data;   
})


const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // ...existing cases...
        .addCase(fetchAllOrders.pending, (state) => {
            state.status = "pending";
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            console.log(action.payload, "fetchall")

            state.status = 'succeeded';
            state.orders = action.payload;
            // console.log(action.payload.data)
        })
        .addCase(fetchAllOrders.rejected, (state) => {
            state.status = "failed";            
        })
        .addCase(createOrder.pending, (state) => {
            state.status = "pending";            
        })
        .addCase(createOrder.fulfilled, (state, action) => {           
                state.status = 'idle'; 
                console.log(action);
              
        })
        .addCase(createOrder.rejected, (state) => {
            state.status = "failed";            
        })
        .addCase(fetchOrderById.pending, (state) => {
          state.status = "pending";
        })
        .addCase(fetchOrderById.fulfilled, (state, action) => {
            console.log(action.payload, "fetchbyId")            
                state.status = 'success';
                state.orderRecord = action.payload.data;              
        })
        .addCase(fetchOrderById.rejected, (state) => {
          state.status = "failed";
        })
  
        .addCase(updateOrder.pending, (state) => {
          state.status = "pending";
        })
        .addCase(updateOrder.fulfilled, (state, action) => {
            console.log(action.payload, "update order")
            if(action.payload.hasOwnProperty('success') && action.payload.success === true  ){
                state.status = 'idle';
                state.orderRecord = orderRecord;
              }else {
                state.status = 'failed';
            }
          
        })
        .addCase(updateOrder.rejected, (state) => {
          state.status = "failed";
        })
  
        .addCase(deleteOrder.pending, (state) => {
          state.status = "pending";
        })
        .addCase(deleteOrder.fulfilled, (state) => {
          //if(state.status === 'pending'){
            
              state.status = 'succeeded';
           
         // }  
        }).addCase(deleteOrder.rejected, (state) => {
          state.status = 'failed';
        })
    },
});
  
export const selectAllOrders = (state: RootState) => state.order.orders
export const selectOrderStatus = (state: RootState) => state.order.status;
export const selectOrderRecord = (state: RootState) => state.order.orderRecord;

export default orderSlice.reducer;