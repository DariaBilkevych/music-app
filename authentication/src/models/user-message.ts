import mongoose, { Document } from 'mongoose';

interface UserMessageAttrs {
  userId: string;
  messages: string[];
  createdAt?: Date;
}

interface UserMessageModel extends mongoose.Model<UserMessageDoc> {
  build(attrs: UserMessageAttrs): UserMessageDoc;
}

interface UserMessageDoc extends Document {
  userId: string;
  messages: string[];
  createdAt: Date;
}

const userMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    messages: {
      type: [String],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
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
