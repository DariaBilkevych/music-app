import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Genre } from '@dbmusicapp/common';
import { UserDoc } from './user';

interface AudioFileAttrs {
  id: string;
  title: string;
  artist: string;
  genre: Genre[];
  year: number;
  duration: number;
  src: string;
  userId: string;
}

export interface AudioFileDoc extends mongoose.Document {
  title: string;
  artist: string;
  genre: Genre[];
  year: number;
  duration: number;
  src: string;
  userId: UserDoc;
  version: number;
}

interface AudioFileModel extends mongoose.Model<AudioFileDoc> {
  build(attr: AudioFileAttrs): AudioFileDoc;
}

const audioFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    genre: {
      type: [
        {
          type: String,
          enum: Object.values(Genre),
          required: true,
        },
      ],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

audioFileSchema.set('versionKey', 'version');
audioFileSchema.plugin(updateIfCurrentPlugin);

audioFileSchema.statics.build = (attrs: AudioFileAttrs) => {
  return new AudioFile({
    _id: attrs.id,
    title: attrs.title,
    artist: attrs.artist,
    genre: attrs.genre,
    year: attrs.year,
    duration: attrs.duration,
    src: attrs.src,
    userId: attrs.userId,
  });
};

const AudioFile = mongoose.model<AudioFileDoc, AudioFileModel>(
  'AudioFile',
  audioFileSchema
);

export { AudioFile };
