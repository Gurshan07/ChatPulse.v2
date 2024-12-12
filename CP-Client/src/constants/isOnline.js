import { SampleChats } from "./sampleData";

const isOnline = (members, onlineUsers, newMessagesAlert) => {
  let chats = [...SampleChats]; // assuming SampleChats is an array
  
  chats.map((data, index) => {
    const { avatar, _id, name, groupChat, members } = data;


    const isOnline = members?.some((member) => onlineUsers.includes(member._id)) // assuming member is an object with _id property
  })
}

export default isOnline;