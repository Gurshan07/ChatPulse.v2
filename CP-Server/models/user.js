import mongoose, { Schema, model } from "mongoose";
import { hash } from "bcrypt";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender :{
      type : String,
      required: false,
      default : '0'
    },
    email :{
      type : String,
      required: true,
    }
    ,
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    colors:{
      uiColor1: {
          type: String,
          required: true,
      },
      uiColor2: {
          type: String,
          required: true,
      },
      darkmode: {
          type: Boolean,
          default: true,
      },
  },
  isOnline:{
    type:Boolean,
    default: false,
  }
  
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", schema);