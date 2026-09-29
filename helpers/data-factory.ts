import { faker } from '@faker-js/faker';
import type { Booking, OptionalBooking, UserCredentials, UserRoleType } from '../types';
import { UserRole } from '../types';

export class DataFactory {

    // Create booking with random data + optional overrides
    static createBooking(userInput?: OptionalBooking): Booking {
        const bookingData: Booking = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            totalprice: faker.number.int({ min: 100, max: 10000 }),
            depositpaid: faker.datatype.boolean(),
            bookingdates: {
                checkin: faker.date.future().toISOString().slice(0, 10),
                checkout: faker.date.future().toISOString().slice(0, 10),
            },
            additionalneeds: faker.helpers.arrayElement([
                'Breakfast', 'Lunch', 'Dinner', 'None'
            ]),
        };

        return {
            ...bookingData,
            ...userInput,
            bookingdates: {
                ...bookingData.bookingdates,
                ...userInput?.bookingdates,
            },
        };
    }

    // Create user credentials for a specific role
    static createUser(role: UserRole): UserCredentials {
        const passwords: Record<UserRole, string> = {
            [UserRole.Standard]: 'bank_sauce',
            [UserRole.Admin]: 'admin_sauce',
            [UserRole.Locked]: 'bank_sauce',
            [UserRole.Frozen]: 'bank_sauce',
            [UserRole.Overdraft]: 'bank_sauce',
            [UserRole.Slow]: 'bank_sauce',
            [UserRole.Error]: 'bank_sauce',
        };

        const roleTypes: Record<UserRole, UserRoleType> = {
            [UserRole.Standard]: 'standard',
            [UserRole.Admin]: 'admin',
            [UserRole.Locked]: 'locked',
            [UserRole.Frozen]: 'frozen',
            [UserRole.Overdraft]: 'overdraft',
            [UserRole.Slow]: 'slow',
            [UserRole.Error]: 'error',
        };

        return {
            username: role,
            password: passwords[role],
            role: roleTypes[role],
        };
    }

    // Create multiple bookings
    static createBookings(count: number, overrides?: OptionalBooking): Booking[] {
        if (!Number.isInteger(count) || count < 1) {
            throw new Error('Booking count must be a positive integer');
        }

        return Array.from({ length: count }, () =>
            DataFactory.createBooking(overrides)
        );
    }
}
