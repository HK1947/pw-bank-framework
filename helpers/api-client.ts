import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking, BookingResponse } from '../types';

interface AuthResponse {
  token: string;
}

function requiredApiEnv(name: 'API_USERNAME' | 'API_PASSWORD'): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for API authentication`);
  return value;
}

export class ApiClient {
  private token = '';

  constructor(private readonly api: APIRequestContext) {}

  private async assertStatus(response: APIResponse, expected: number): Promise<void> {
    if (response.status() !== expected) {
      const body = await response.text();
      throw new Error(`${response.url()} returned ${response.status()}, expected ${expected}: ${body}`);
    }
  }

  async authenticate(): Promise<void> {
    const response = await this.api.post('auth', {
      data: {
        username: requiredApiEnv('API_USERNAME'),
        password: requiredApiEnv('API_PASSWORD'),
      },
    });
    await this.assertStatus(response, 200);
    const body = (await response.json()) as Partial<AuthResponse>;
    if (!body.token) throw new Error('Authentication response did not contain a token');
    this.token = body.token;
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    const response = await this.api.post('booking', { data: booking });
    await this.assertStatus(response, 200);
    const body = (await response.json()) as Partial<BookingResponse>;
    if (!body.bookingid || !body.booking) throw new Error('Create booking response has an invalid schema');
    return body as BookingResponse;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const response = await this.api.get(`booking/${id}`);
    if (response.status() === 404) return undefined;
    await this.assertStatus(response, 200);
    return (await response.json()) as Booking;
  }

  async updateBooking(id: number, booking: Booking): Promise<Booking> {
    const response = await this.api.put(`booking/${id}`, {
      headers: { Cookie: `token=${this.token}` },
      data: booking,
    });
    await this.assertStatus(response, 200);
    return (await response.json()) as Booking;
  }

  async deleteBooking(id: number): Promise<void> {
    const response = await this.api.delete(`booking/${id}`, {
      headers: { Cookie: `token=${this.token}` },
    });
    await this.assertStatus(response, 201);
  }
}
