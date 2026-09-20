import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { DataFactory } from '../../helpers/data-factory';
import { Logger } from '../../helpers/logger';


const log = Logger.getInstance();


test('full CRUD lifecycle using ApiClient', async({request})=>{

const client = new ApiClient(request)
await client.authenticate()
log.step('Logged in successfully collected token for next tests')


const bookingData = DataFactory.createBooking({firstname:'harsha kumar k s'});
log.step(`booking created for ${bookingData.firstname}`)
const { bookingid } = await client.createBooking(bookingData)
expect(bookingid).toBeTruthy();
log.success(`Created booking #${bookingid}`);

const savedBooking = await client.getBooking(bookingid) as any;
expect(savedBooking.firstname).toBe('harsha kumar k s')
expect(savedBooking.totalprice).toBe(bookingData.totalprice);
log.success(`Read booking: ${savedBooking.firstname} ${savedBooking.lastname}`)


const deleteStatus = await client.deleteBooking(bookingid)
expect(deleteStatus).toBe(201)
log.success(`Deleted booking #${bookingid}`);

const bookingDeleted = await client.getBooking(bookingid) as any
expect(bookingDeleted.firstname).toBeUndefined()
log.success('Verified booking is gone');


})