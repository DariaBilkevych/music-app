import moment from 'moment-timezone';
import { BadRequestError } from '@dbmusicapp/common';

const getStartEndDates = (
  period: string
): { startDate: Date; endDate: Date } => {
  const periodOptions = {
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year',
  };

  if (periodOptions.hasOwnProperty(period)) {
    let periodType: moment.unitOfTime.StartOf =
      period as moment.unitOfTime.StartOf;
    const startDateString = moment
      .tz('Europe/Kiev')
      .startOf(periodType)
      .format('YYYY-MM-DDTHH:mm:ss');
    const endDateString = moment
      .tz('Europe/Kiev')
      .endOf(periodType)
      .format('YYYY-MM-DDTHH:mm:ss');
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    return { startDate, endDate };
  } else {
    throw new BadRequestError('Invalid period');
  }
};

export { getStartEndDates };
