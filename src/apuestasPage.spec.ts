import { describe, it, expect } from 'vitest'
import ApuestaPage from './routes/+page.svelte'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

describe('Apuestas page', () => {
	it('debe fallar si se ingresa un importe negativo', async () => {
		render(ApuestaPage)
		await userEvent.type(screen.getByTestId('monto'), '-10')
		await screen.getByTestId('btnApuesta').click()
		expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('El monto a apostar debe ser positivo. Debe apostar más de 10 $')
	})
})
