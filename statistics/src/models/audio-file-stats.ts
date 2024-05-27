import mongoose from 'mongoose';
import { AudioFileDoc } from './audio-file';

interface AudioFileStatsAttrs {
  audioFileId: AudioFileDoc;
  date: Date;
  playCount: number;
}

interface AudioFileStatsDoc extends mongoose.Document {
  audioFileId: AudioFileDoc; // ID треку
  date: Date; //дата для агрегованих даних (може бути денна, місячна, річна)
  playCount: number; // кількість прослуховувань за відповідний період
}

interface AudioFileStatsModel extends mongoose.Model<AudioFileStatsDoc> {
  build(attrs: AudioFileStatsAttrs): AudioFileStatsDoc;
}

const audioFileStatsSchema = new mongoose.Schema(
  {
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

audioFileStatsSchema.statics.build = (attr: AudioFileStatsAttrs) => {
  return new AudioFileStats(attr);
};

const AudioFileStats = mongoose.model<AudioFileStatsDoc, AudioFileStatsModel>(
  'AudioFileStats',
  audioFileStatsSchema
);

export { AudioFileStats };
