import mongoose from 'mongoose';
import { AudioFileDoc } from './audio-file';

interface ListeningAttrs {
  userId: string;
  audioFileId: AudioFileDoc;
  timestamps: Date[];
  playCount: number;
}

interface ListeningDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  audioFileId: AudioFileDoc;
  timestamps: Date[];
  playCount: number;
}

interface ListeningModel extends mongoose.Model<ListeningDoc> {
  build(attrs: ListeningAttrs): ListeningDoc;
}

const listeningSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  audioFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AudioFile',
  },
  timestamps: [
    {
      type: Date,
    },
  ],
  playCount: {
    type: Number,
    default: 0,
  },
});

listeningSchema.statics.build = (attr: ListeningAttrs) => {
  return new Listening(attr);
};

const Listening = mongoose.model<ListeningDoc, ListeningModel>(
  'Listening',
  listeningSchema
);

export { Listening };
