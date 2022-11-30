import { differenceInMinutes, format } from 'date-fns';

export const getFormattedDate = (dateString = '') => format(new Date(dateString), 'MMM dd p');

export const getFormattedDuration = (endDate: Date, startDate: Date) => {
  const totalMinutes = differenceInMinutes(endDate, startDate);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes}min`;
};
