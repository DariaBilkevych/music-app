import mongoose from 'mongoose';
import { transform } from 'typescript';

interface AudioFileAttrs {
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  src: string;
}

interface AudioFileDoc extends mongoose.Document {
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  src: string;
}

interface AudioFileModel extends mongoose.Model<AudioFileDoc> {
  build(attr: AudioFileAttrs): AudioFileDoc;
}

const audiFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
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

audiFileSchema.statics.build = (attr: AudioFileAttrs) => {
  return new AudioFile(attr);
};

const AudioFile = mongoose.model<AudioFileDoc, AudioFileModel>(
  'AudioFile',
  audiFileSchema
);

export { AudioFile };
