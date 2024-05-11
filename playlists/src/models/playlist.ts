import mongoose from 'mongoose';
import { transform } from 'typescript';
import { AudioFileDoc } from './audio-file';

interface PlaylistAttrs {
  userId: string;
  title: string;
  audioFiles: AudioFileDoc[];
}

interface PlaylistDoc extends mongoose.Document {
  userId: string;
  title: string;
  audioFiles: AudioFileDoc[];
}

interface PlaylistModel extends mongoose.Model<PlaylistDoc> {
  build(attr: PlaylistAttrs): PlaylistDoc;
}

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    audioFiles: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'AudioFile',
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

playlistSchema.statics.build = (attr: PlaylistAttrs) => {
  return new Playlist(attr);
};

const Playlist = mongoose.model<PlaylistDoc, PlaylistModel>(
  'Playlist',
  playlistSchema
);

export { Playlist };
