import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Genre } from '@dbmusicapp/common';

interface AudioFileAttrs {
  title: string;
  artist: string;
  genre: Genre[];
  year: number;
  duration: number;
  src: string;
  userId: string;
}

interface AudioFileDoc extends mongoose.Document {
  title: string;
  artist: string;
  genre: Genre[];
  year: number;
  duration: number;
  src: string;
  userId: string;
  version: number;
}

interface AudioFileModel extends mongoose.Model<AudioFileDoc> {
  build(attrs: AudioFileAttrs): AudioFileDoc;
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
      type: String,
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

audioFileSchema.set('versionKey', 'version');
audioFileSchema.plugin(updateIfCurrentPlugin);

audioFileSchema.statics.build = (attrs: AudioFileAttrs) => {
  return new AudioFile(attrs);
};

const AudioFile = mongoose.model<AudioFileDoc, AudioFileModel>(
  'AudioFile',
  audioFileSchema
);

export { AudioFile };
