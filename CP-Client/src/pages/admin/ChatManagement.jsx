import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

const columns = [
 
  {
    field: 'members',
    headerName: 'Members',
    headerClassName: 'table-header',
    width: 250,
    renderCell: (params) => (<AvatarCard max={100} avatar={params.row.members} />)
  },
  {
    field: 'name',
    headerName: 'Name',
    headerClassName: 'table-header',
    width: 200
  },
  {
    field: 'totalMembers',
    headerName: 'Total Members',
    headerClassName: 'table-header',
    width: 120
  },

  {
    field: 'totalMessages',
    headerName: 'Total Messages',
    headerClassName: 'table-header',
    width: 120
  },
  {
    field: 'creator',
    headerName: 'Created By',
    headerClassName: 'table-header',
    width: 125,
    renderCell: (params) => (
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} >
          <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
          <span>{params.row.creator.name}</span>
      </Stack>
    )

  },
]


const ChatManagement = () => {

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);
  
  return (
    <AdminLayout>
    {loading ? (
      <Skeleton height={"100vh"} />
    ) : (
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    )}
  </AdminLayout>
  )
}



export default ChatManagement
