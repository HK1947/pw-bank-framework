import { expect, test } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { DataFactory } from '../../helpers/data-factory';
import { Logger } from '../../helpers/logger';

const log = Logger.getInstance();

test('full CRUD lifecycle using ApiClient @api', async ({ request }) => {
    const client = new ApiClient(request);
    await client.authenticate();
    log.step('Authenticated and received an API token');

    const bookingData = DataFactory.createBooking({ firstname: 'Harsha' });
    const { bookingid } = await client.createBooking(bookingData);
    log.success(`Created booking #${bookingid}`);

    try {
        const savedBooking = await client.getBooking(bookingid);
        expect(savedBooking).toBeDefined();
        expect(savedBooking?.firstname).toBe('Harsha');
        expect(savedBooking?.totalprice).toBe(bookingData.totalprice);
        log.success(`Read booking: ${savedBooking?.firstname} ${savedBooking?.lastname}`);
    } finally {
        const deleteStatus = await client.deleteBooking(bookingid);
        expect(deleteStatus).toBe(201);
        log.success(`Deleted booking #${bookingid}`);
    }

    await expect.poll(() => client.getBooking(bookingid)).toBeUndefined();
    log.success('Verified booking is gone');
});
