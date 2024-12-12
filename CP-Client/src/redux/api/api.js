import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message","Counter"],

  endpoints: (builder) => ({

    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    getCounter: builder.query({
      query: () => ({
        url: "counter",
        credentials: "include",
      }),
      providesTags: ["Counter"],
    }),

    updateCounter: builder.mutation({
      query: (newValue) => ({
        url: "counter",
        method: "POST",
        credentials: "include",
        body: { value: newValue },
      }),
      invalidatesTags: ["Counter"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `user/notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    putColor: builder.mutation({
      query: ({ uiColor1, uiColor2, darkmode }) => ({
        url: "user/putcolor",
        method: "PUT",
        credentials: "include",
        body: {
          colors: {
            uiColor1,
            uiColor2,
            darkmode
          }
        },
      }),
      invalidatesTags: ["User"],
    }),
    
    getColor: builder.query({
      query: () => ({
        url: "user/getcolor",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    myGroups: builder.query({
      query: () => ({
        url: "chat/my/groups",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/removemember`,
        method: "PUT",
        credentials: "include",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/addmembers`,
        method: "PUT",
        credentials: "include",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),

    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),

    getMyAvatar :builder.query({
      query: () => ({
        url: "user/getmyinfo",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => ({ avatar: response.user.avatar }), 
      providesTags: ["User"],
    }),

    getMyBio :builder.query({
      query: () => ({
        url: "user/getmyinfo",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => ({ bio: response.user.bio }), 
      providesTags: ["User"],
    }),
    
    getMyGender :builder.query({
      query: () => ({
        url: "user/getmyinfo",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => ({ gender: response.user.gender }), 
      providesTags: ["User"],
    }),

    getMyOtp :builder.query({
      query: () => ({
        url: "user/getotp",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    ValidateOtp: builder.mutation({
      query: ({ userId, otp }) => ({
          url: `user/validateotp`,
          method: "POST",
          credentials: "include",
          body: { userId, otp }, 
      }),
      invalidatesTags: ["User"],
  }),
 
    changeBio: builder.mutation({
      query: ({ bio }) => ({
        url: `user/changebio`,
        method: "PUT",
        credentials: "include",
        body: { bio },
      }),
      invalidatesTags: ["User"],
    }),
    
    changeGender: builder.mutation({
      query: ({ gender }) => ({
        url: `user/changegender`,
        method: "PUT",
        credentials: "include",
        body: { gender },
      }),
      invalidatesTags: ["User"],
    }),

    changeUsername : builder.mutation({
      query: ({username}) => ({
        url: `user/changeusername`,
        method: "PUT",
        credentials: "include",
        body: { username },
      }),
      invalidatesTags: ["User"],
    }),

    changeEmail : builder.mutation({
      query: ({ email }) => ({
        url: `user/changeemail`,
        method: "PUT",
        credentials: "include",
        body: { email },
      }),
      invalidatesTags: ["User"],
    }),

    changeCustomedAvatar: builder.mutation({
      query: ({ avatar, file }) => {
        const formData = new FormData();
        
        formData.append('avatar', file);
        formData.append('url', avatar.url);
        formData.append('public_id', avatar.public_id);
    
        return {
          url: `user/changeavatar`,
          method: "PUT",
          credentials: "include",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
    changeGeneratedAvatar: builder.mutation({
      query: ({ avatar }) => {
        return {
          url: `user/changegavatar`,
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({ avatar }),  
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: ["User"],
    }),

    getIsOnline : builder.query({
      query: () => ({
        url: "user/isonline",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    })
    
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useGetCounterQuery,  
  useUpdateCounterMutation,  
  usePutColorMutation,
  useGetColorQuery,
  useGetMyAvatarQuery,
  useChangeBioMutation,
  useGetMyBioQuery,
  useGetMyGenderQuery,
  useLazyGetMyOtpQuery ,
  useChangeGenderMutation,
  useChangeUsernameMutation, 
  useChangeEmailMutation,
  useChangeCustomedAvatarMutation,
  useChangeGeneratedAvatarMutation,
  useValidateOtpMutation,
  useGetIsOnlineQuery,
  
} = api;