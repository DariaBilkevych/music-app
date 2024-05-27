import mongoose from 'mongoose';
import { AudioFileDoc } from './audio-file';

interface UserStatsAttrs {
  userId: string;
  audioFileId: AudioFileDoc;
  date: Date;
  playCount: number;
}

interface UserStatsDoc extends mongoose.Document {
  userId: string; // ID користувача
  audioFileId: AudioFileDoc; // ID треку
  date: Date; //дата прослуховування
  playCount: number; // кількість прослуховувань за відповідний період
}

interface UserStatsModel extends mongoose.Model<UserStatsDoc> {
  build(attrs: UserStatsAttrs): UserStatsDoc;
}

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    audioFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioFile',
    },
    date: {
      type: Date,
      required: true,
    },
    playCount: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userStatsSchema.statics.build = (attr: UserStatsAttrs) => {
  return new UserStats(attr);
};

const UserStats = mongoose.model<UserStatsDoc, UserStatsModel>(
  'UserStats',
  userStatsSchema
);

export { UserStats };
