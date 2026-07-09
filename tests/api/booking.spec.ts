import { test, expect } from '@fixtures/fixture';
import { buildBooking } from '@data/booking.data';

test.describe('API - Booker', () => {
    test('POST /auth retorna token com sucesso', async ({
        request
    }) => {
        const response = await request.post('/auth', {
            data: { username: process.env.API_USERNAME, password: process.env.API_PASSWORD },
        })
        expect(response.ok()).toBeTruthy();
        const body = (await response.json()) as { token?: string };
        expect(body.token).toBeTruthy();
        expect(typeof body.token).toBe('string');
    }
    )

    test('Post /booking para criar um booking e retorna dados enviados', async ({ bookingApi }) => {
        const payload = buildBooking({
            firstname: 'Vitor',
            lastname: 'Silva'
        });
        const { id, response } = await bookingApi.createBooking(payload);
        expect(response.status()).toBe(200);
        expect(id).toBeGreaterThan(0);

        const body = (await response.json()) as {
            bookingid: number;
            booking: typeof payload;
        };
        expect(body.booking).toMatchObject({ ...payload });
    })

    test('GET /booking/{id} retorna os dados do booking criado', async ({
        bookingApi,
    }) => {
        const payload = buildBooking();
        const { id } = await bookingApi.createBooking(payload);
        const response = await bookingApi.getBooking(id);
        expect(response.status()).toBe(200);

        const body = (await response.json()) as typeof payload;

        expect(body).toMatchObject({ ...payload });
    });

    test('PUT /booking/{id} atualiza o booking', async ({ bookingApi }) => {
        const { id } = await bookingApi.createBooking(buildBooking());

        const updated = buildBooking({
            firstname: 'Ze',
            lastname: 'Roberto',
            totalprice: 8898,
            additionalneeds: 'Early checkin'
        })
        const updateResponse = await bookingApi.updateBooking(id, updated);
        expect(updateResponse.status()).toBe(200);

        const body = (await updateResponse.json()) as typeof updated;
    });

    test('DELETE /booking/{id} remove o booking (GET posterior retorna 404)', async ({
        bookingApi,
    }) => {
        const { id } = await bookingApi.createBooking(buildBooking());

        const deleteResponse = await bookingApi.deleteBooking(id);
        expect([200, 201]).toContain(deleteResponse.status());

        const getResponse = await bookingApi.getBooking(id);
        expect(getResponse.status()).toBe(404);
    });
    test('DELETE sem autenticação é rejeitado', async ({ request, bookingApi }) => {
        const { id } = await bookingApi.createBooking(buildBooking());

        const response = await request.delete(`/booking/${id}`);
        expect(response.status()).toBe(403);
    });
});