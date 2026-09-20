import { faker } from '@faker-js/faker';
import { type Booking, type OptionalBooking, type UserCredentials, UserRole, type UserRoleType } from '../types';

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export class DataFactory {
  static createBooking(overrides?: OptionalBooking): Booking {
    const checkin = faker.date.soon({ days: 90 });
    const checkout = faker.date.soon({ days: 14, refDate: checkin });
    const booking: Booking = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 10_000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
      additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'None']),
    };
    return { ...booking, ...overrides };
  }

  static createUser(role: UserRole): UserCredentials {
    const roleTypes: Record<UserRole, UserRoleType> = {
      [UserRole.Standard]: 'standard',
      [UserRole.Admin]: 'admin',
      [UserRole.Locked]: 'locked',
      [UserRole.Frozen]: 'frozen',
      [UserRole.Overdraft]: 'overdraft',
      [UserRole.Slow]: 'slow',
      [UserRole.Error]: 'error',
    };
    const password = role === UserRole.Admin ? process.env.ADMIN_PASS : process.env.STANDARD_PASS;
    if (!password) throw new Error(`Password environment variable is required for ${role}`);
    return { username: role, password, role: roleTypes[role] };
  }

  static createBookings(count: number, overrides?: OptionalBooking): Booking[] {
    if (!Number.isInteger(count) || count < 0) throw new Error('count must be a non-negative integer');
    return Array.from({ length: count }, () => DataFactory.createBooking(overrides));
  }
}
