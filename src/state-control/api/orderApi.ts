import { createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../../main";
import { axiosBaseQuery } from "../../config/axiosBaseQuery";
import { OrderType } from "../../types/models";

type OrderResponse = OrderType[];

const BASE_URL = import.meta.env.VITE_API_SERVER_ENDPOINT as string;


export const orderApi = createApi({
  reducerPath: "bookApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${BASE_URL}/api/book/` }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    storeOrder: builder.mutation<OrderType,  Record<string, unknown>>({
      query: (data) => {
        return {
          url: `create`,
          method: "post",
          credentials: "include",
          data,
        };
      },
    }),
    updateOrder: builder.mutation<OrderType, Record<any, any>>({
      query: (data) => {
        console.log(data, "data")
        return {
          url: `${data.id}`,
          method: "patch",
          data,
        };
      },
    }),
    getAllOrders: builder.query<OrderResponse, void>({
      query: () => ({
        url: "lists",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<OrderType, string>({
      query: (id: string) => ({
        url: `${id}`,
        method: "GET",
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
