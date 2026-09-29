import type { APIRequestContext, APIResponse } from '@playwright/test';
import { z } from 'zod';
import { getEnvironment } from '../config/environment';
import type { Booking, BookingResponse } from '../types';

const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string(),
  }),
  additionalneeds: z.string().optional(),
});

const bookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

const authResponseSchema = z.object({ token: z.string().min(1) });

export class ApiClient {
  private token?: string;
  private readonly baseUrl: string;

  constructor(private readonly api: APIRequestContext, baseUrl = getEnvironment().API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async authenticate(): Promise<void> {
    const environment = getEnvironment();
    const response = await this.api.post(this.url('/auth'), {
      data: {
        username: environment.API_USERNAME,
        password: environment.API_PASSWORD,
      },
    });
    await this.assertStatus(response, 200);
    const body: unknown = await response.json();
    this.token = authResponseSchema.parse(body).token;
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    const response = await this.api.post(this.url('/booking'), { data: booking });
    await this.assertStatus(response, 200);
    const body: unknown = await response.json();
    return bookingResponseSchema.parse(body);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const response = await this.api.get(this.url(`/booking/${id}`));
    if (response.status() === 404) return undefined;
    await this.assertStatus(response, 200);
    const body: unknown = await response.json();
    return bookingSchema.parse(body);
  }

  async updateBooking(id: number, booking: Booking): Promise<Booking> {
    const response = await this.api.put(this.url(`/booking/${id}`), {
      headers: { Cookie: `token=${this.requiredToken()}` },
      data: booking,
    });
    await this.assertStatus(response, 200);
    const body: unknown = await response.json();
    return bookingSchema.parse(body);
  }

  async deleteBooking(id: number): Promise<void> {
    const response = await this.api.delete(this.url(`/booking/${id}`), {
      headers: { Cookie: `token=${this.requiredToken()}` },
    });
    await this.assertStatus(response, 201);
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private requiredToken(): string {
    if (!this.token) throw new Error('ApiClient must authenticate before a write operation');
    return this.token;
  }

  private async assertStatus(response: APIResponse, expected: number): Promise<void> {
    if (response.status() === expected) return;
    const body = await response.text();
    throw new Error(`${response.url()} returned ${response.status()}, expected ${expected}: ${body}`);
  }
}
