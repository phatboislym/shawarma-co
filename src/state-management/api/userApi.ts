import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { UserType } from '../../types/models';

const BASE_URL = import.meta.env.VITE_API_SERVER_ENDPOINT as string;

export const userApi = createApi({
    reducerPath: "authCheckApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/user`,
    }),
    endpoints: (builder) => ({        
        getUser: builder.query<UserType, string>({
            query: (id: string) => ({
              url: `${id}`,
              method: "GET",
            })
        }),      
    })
})

export const { useGetUserQuery } = userApi;