import mongoose from 'mongoose';

interface UserAttrs {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  role: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    name: attrs.name,
    email: attrs.email,
    role: attrs.role,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
