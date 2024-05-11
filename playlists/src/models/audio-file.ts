import mongoose from 'mongoose';

interface AudioFileAttrs {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  src: string;
}

export interface AudioFileDoc extends mongoose.Document {
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

audioFileSchema.statics.build = (attrs: AudioFileAttrs) => {
  return new AudioFile({
    _id: attrs.id,
    title: attrs.title,
    artist: attrs.artist,
    album: attrs.album,
    year: attrs.year,
    duration: attrs.duration,
    src: attrs.src,
  });
};

const AudioFile = mongoose.model<AudioFileDoc, AudioFileModel>(
  'AudioFile',
  audioFileSchema
);

export { AudioFile };