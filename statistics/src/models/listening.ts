import mongoose from 'mongoose';
import { AudioFileDoc } from './audio-file';

interface ListeningAttrs {
  userId: string;
  audioFileId: AudioFileDoc;
  timestamp: Date;
}

interface ListeningDoc extends mongoose.Document {
  userId: string; // Ідентифікатор користувача, який слухає
  audioFileId: AudioFileDoc; // Ідентифікатор треку
  timestamp: Date; // Час прослуховування
}

interface ListeningModel extends mongoose.Model<ListeningDoc> {
  build(attrs: ListeningAttrs): ListeningDoc;
}

const listeningSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    audioFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioFile',
    },
    timestamp: {
      type: Date,
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

listeningSchema.statics.build = (attr: ListeningAttrs) => {
  return new Listening(attr);
};

const Listening = mongoose.model<ListeningDoc, ListeningModel>(
  'Listening',
  listeningSchema
);

export { Listening };
