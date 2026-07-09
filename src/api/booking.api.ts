import { type APIRequestContext, type APIResponse, expect } from '@playwright/test';
import { apiCredentials, type Booking } from '@data/booking.data';

/**
 * Camada de serviço para a API Restful Booker.
 * Encapsula os endpoints e a autenticação, mantendo os testes limpos.
 *
 * Observação sobre autenticação: a API aceita tanto um cookie `token`
 * quanto Basic Auth no header. Aqui usamos o token via cookie header,
 * conforme a documentação oficial.
 */
export class BookingApi {
    private token: string | null = null;

    constructor(private readonly request: APIRequestContext) { }

    async authenticate(): Promise<string> {
        const response = await this.request.post('/auth', {
            data: apiCredentials,
        });
        expect(response.ok()).toBeTruthy();

        const body = (await response.json()) as {
            token?: string
        }
        expect(body.token, 'a API deve retornar um token').toBeTruthy();
        this.token = body.token as string
        return this.token;
    }

    private authHeaders(): Record<string, string> {
        if (!this.token) {
            throw new Error("Chame o metodo authenticate() antes de opecoes que precisem de token");
        } return { Cookie: `token=${this.token}` }
    }

    async createBooking(booking: Booking): Promise<{ id: number; response: APIResponse }> {
        const response = await this.request.post('/booking', { data: booking });
        const body = (await response.json()) as { bookingid: number };
        return { id: body.bookingid, response }
    }

    async getBooking(id: number): Promise<APIResponse> {
        return this.request.get(`/booking/${id}`);
    }

    async updateBooking(id: number, booking: Booking): Promise<APIResponse> {
        return this.request.put(`/booking/${id}`, {
            data: booking, headers: this.authHeaders()
        })
    }

    async deleteBooking(id: number): Promise<APIResponse> {
        return this.request.delete(`/booking/${id}`, {
            headers: this.authHeaders(),
        }
        );
    }

}