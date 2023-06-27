import { createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../../main";
import { axiosBaseQuery } from "../../config/axiosBaseQuery";
import { OrderType } from "../../types/models";

type OrderResponse = OrderType[];

const BASE_URL = import.meta.env.VITE_API_SERVER_ENDPOINT as string;


export const orderApi = createApi({
  reducerPath: "bookApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${BASE_URL}/orders/` }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    storeOrder: builder.mutation<OrderType,  Record<string, unknown>>({
      query: (data) => {
        return {
          url: `order`,
          method: "post",
          credentials: "include",
          data,
        };
      },
    }),
    updateOrder: builder.mutation<OrderType, Record<any, any>>({
      query: (data) => {        
        return {
          url: `order/update${data.id_}`,
          method: "patch",
          data,
        };
      },
    }),
    getAllOrders: builder.query<OrderResponse, void>({
      query: () => ({
        url: "",        
      }),
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<OrderType, string>({
      query: (id: string) => ({ 
        url: `${id}`
      }),
    }),
    deleteOrder: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useStoreOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
