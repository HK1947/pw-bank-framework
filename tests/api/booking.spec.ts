import { test, expect } from '../../fixtures/test-fixtures';
import { DataFactory } from '../../helpers/data-factory';

test('full booking CRUD lifecycle @api', async ({ apiClient }) => {
  const original = DataFactory.createBooking({ firstname: 'Framework', lastname: 'Audit' });
  let bookingId: number | undefined;

  try {
    const created = await apiClient.createBooking(original);
    bookingId = created.bookingid;
    expect(created.booking).toEqual(original);

    const saved = await apiClient.getBooking(bookingId);
    expect(saved).toEqual(original);

    const updatedData = { ...original, firstname: 'Updated', totalprice: original.totalprice + 1 };
    const updated = await apiClient.updateBooking(bookingId, updatedData);
    expect(updated).toEqual(updatedData);

    await apiClient.deleteBooking(bookingId);
    bookingId = undefined;
    await expect.poll(() => apiClient.getBooking(created.bookingid)).toBeUndefined();
  } finally {
    if (bookingId !== undefined) await apiClient.deleteBooking(bookingId);
  }
});
