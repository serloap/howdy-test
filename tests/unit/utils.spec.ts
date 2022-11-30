import { getFormattedDate, getFormattedDuration } from '@/utils';

describe('Test Utils', () => {
  it('Formats date correctly', () => {
    expect(getFormattedDate('2022-12-07T07:00:00')).toBe('Dec 07 7:00 AM');
  });

  it('Formats duration correctly', () => {
    const startDate = new Date('2022-12-07T07:00:00');
    const endDate = new Date('2022-12-07T10:15:00');

    const duration = getFormattedDuration(endDate, startDate);

    expect(duration).toBe('3h15min');
  });
});
