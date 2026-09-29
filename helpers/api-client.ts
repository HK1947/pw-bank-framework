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
    private readonly api: APIRequestContext;
    private readonly baseUrl: string;
    private token?: string;

    constructor(api: APIRequestContext, baseUrl = getEnvironment().API_BASE_URL) {
        this.api = api;
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

        await this.requireOk(response, 'authenticate');
        const body: unknown = await response.json();
        this.token = authResponseSchema.parse(body).token;
    }

    async createBooking(bookingData: Booking): Promise<BookingResponse> {
        const response = await this.api.post(this.url('/booking'), {
            headers: this.jsonHeaders(),
            data: bookingData,
        });

        await this.requireOk(response, 'create booking');
        const body: unknown = await response.json();
        return bookingResponseSchema.parse(body);
    }

    async getBooking(id: number): Promise<Booking | undefined> {
        const response = await this.api.get(this.url(`/booking/${id}`), {
            headers: this.jsonHeaders(),
        });

        if (response.status() === 404) {
            return undefined;
        }

        await this.requireOk(response, `get booking ${id}`);
        const body: unknown = await response.json();
        return bookingSchema.parse(body);
    }

    async deleteBooking(id: number): Promise<number> {
        if (!this.token) {
            throw new Error('ApiClient must be authenticated before deleting a booking');
        }

        const response = await this.api.delete(this.url(`/booking/${id}`), {
            headers: {
                Cookie: `token=${this.token}`,
                ...this.jsonHeaders(),
            },
        });

        await this.requireOk(response, `delete booking ${id}`);
        return response.status();
    }

    private url(path: string): string {
        return `${this.baseUrl}${path}`;
    }

    private jsonHeaders(): Record<string, string> {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
    }

    private async requireOk(response: APIResponse, operation: string): Promise<void> {
        if (response.ok()) {
            return;
        }

        const responseBody = await response.text();
        throw new Error(
            `API operation failed (${operation}): ${response.status()} ${response.statusText()} - ${responseBody}`,
        );
    }
}
