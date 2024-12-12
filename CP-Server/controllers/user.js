import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
  deleteFilesFromCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { generateAndStoreOTP, verifyOTP } from '../Redis/otpService.js' 


// Create a new user and save it to the database and save token in cookie
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  const user = await User.findOne({ username: trimmedUsername }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Username or Password", 404));
  }

  const isMatch = await compare(trimmedPassword, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Username or Password", 404));
  }

  await User.findByIdAndUpdate(user._id, { isOnline: true });

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});


const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  await User.findByIdAndUpdate(userId, { isOnline: false });

  return res
    .status(200)
    .cookie("ChatPulse-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name = "" } = req.query;

  // Finding All my chats
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  //  extracting All Users from my chats means friends or people I have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Finding all users except me and my friends
  // const allUsersExceptMeAndFriends = await User.find({
  //   _id: { $nin: allUsersFromMyChats },
  //   name: { $regex: name, $options: "i" },
  // });
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: [...allUsersFromMyChats, req.user] },
    name: { $regex: name, $options: "i" },
  });

  // Modifying the response
  // const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
  //   _id,
  //   name,
  //   avatar: avatar.url,
  // }));
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }))
    .filter(({ _id }) => _id !== req.user);

  return res.status(200).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const putMyColors = TryCatch(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const { colors } = req.body;
  const { uiColor1, uiColor2, darkmode } = colors;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      colors: {
        uiColor1,
        uiColor2,
        darkmode,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    colors: updatedUser.colors,
  });
});

const getMyColors = TryCatch(async (req, res) => {

  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const userColors = await User.findById(userId).select('colors');  

  if (!userColors || !userColors.colors) {
    return res.status(404).json({ success: false, message: 'No colors found for this user' });
  }

  return res.status(200).json({
    success: true,
    colors: userColors.colors,  
  });
});

const getMyInfo = TryCatch(async (req, res) => {

  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const userAvatar = await User.findById(userId).select('name bio username avatar gender');

  return res.status(200).json({
    success: true,
    user: userAvatar,
  });
});

const getMyOTP = TryCatch(async (req, res) => {
  const userId = req.user; 

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const otp = await generateAndStoreOTP(userId);

  return res.status(200).json({
    success: true,
    message: 'OTP generated successfully',
    otp, 
  });
});

const validateMyOtp = TryCatch(async (req, res) => {
  const userId = req.user;  
  const otp = req.body.otp; 

  if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const user = await User.findById(userId);
  if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
  }
console.log("otp",otp)
  verifyOTP(userId, otp, (result) => {
      console.log("OTP verification result:", result);
      
      if (result.success) {
          return res.status(200).json({
              success: true,
              message: 'OTP validated successfully',
          });
      } 
      else {
          return res.status(200).json({
              success: false,
              message: result.message, 
          });
      }
  });
});

const changeMyBio = TryCatch(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const { bio } = req.body;

  if (!bio) {
    return res.status(400).json({ success: false, message: 'Bad Request: Bio is required' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { bio },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    updatedBio: updatedUser.bio,
  });

});

const changeMyGender = TryCatch(async (req, res) => {

  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const { gender } = req.body;

  if (!gender) {
    return res.status(400).json({ success: false, message: 'Bad Request: Gender is required' });
  }


  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { gender },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    updatedGender: updatedUser.gender,
  });

})

const changeMyUsername = TryCatch(async (req, res) => {

  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Bad Request: Username is required' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    updatedUser: updatedUser.username,
  });

})

const changeMyEmail = TryCatch(async (req, res) => {

  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Bad Request: Email is required' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json({
    success: true,
    updatedEmail: updatedUser.email,
  });
})

const changeCustomedMyAvatar = TryCatch(async (req, res) => {
  const userId = req.user; 

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Bad Request: An image file is required' });
  }

  const currentUser = await User.findById(userId);
  
  if (!currentUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const oldPublicId = currentUser.avatar?.public_id;

  const result = await uploadFilesToCloudinary([req.file]);

  const avatar = {
    url: result[0].url,         
    public_id: result[0].public_id 
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (oldPublicId) {
    const deleteResult = await deleteFilesFromCloudinary([oldPublicId]);
    if (!deleteResult.success) {
      console.error("Failed to delete old avatar from Cloudinary:", deleteResult.message);
    }
  }

  return res.status(200).json({
    success: true,
    updatedAvatar: updatedUser.avatar,
  });
});

const changeMyGeneratedAvatar = TryCatch(async (req, res) => {
  const userId = req.user; 

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).json({ success: false, message: 'Bad Request: avatar object is required' });
  }

  const oldPublicId = avatar?.public_id;

  if (oldPublicId) {
    const deleteResult = await deleteFilesFromCloudinary([oldPublicId]);
    if (!deleteResult.success) {
      console.error("Failed to delete old avatar from Cloudinary:", deleteResult.message);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      avatar: { 
        url: avatar?.url,
        public_id: "null" 
      }
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    updatedAvatar: updatedUser.avatar,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

const getIsOnline = TryCatch(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
  }

  const user = await User.findById(userId, 'isOnline');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    isOnline: user.isOnline,
  });
});


export {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  putMyColors,
  getMyColors,
  sendFriendRequest,
  getMyInfo,
  changeMyBio,
  changeMyGender,
  changeMyUsername,
  changeMyEmail,
  changeCustomedMyAvatar,
  changeMyGeneratedAvatar,
  getMyOTP,
  validateMyOtp,
  getIsOnline
 
};
