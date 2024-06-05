import mongoose, { Document } from 'mongoose';

interface Message {
  message: string;
  createdAt: Date;
  read: boolean;
}

interface UserMessageAttrs {
  userId: string;
  messages: Message[];
}

interface UserMessageModel extends mongoose.Model<UserMessageDoc> {
  build(attrs: UserMessageAttrs): UserMessageDoc;
}

interface UserMessageDoc extends Document {
  userId: string;
  messages: Message[];
}

const userMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    messages: [
      {
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userMessageSchema.statics.build = (attrs: UserMessageAttrs) => {
  return new UserMessage(attrs);
};

const UserMessage = mongoose.model<UserMessageDoc, UserMessageModel>(
  'UserMessage',
  userMessageSchema
);

export { UserMessage, UserMessageDoc };
