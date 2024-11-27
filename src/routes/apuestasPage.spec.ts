import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ApuestaPage from './+page.svelte'
import { Apuesta } from '$lib/apuesta'

describe('Apuestas page', () => {

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('debe fallar si se ingresa un importe negativo', async () => {
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '-10')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('El monto a apostar debe ser positivo. Debe apostar más de 10 $')
	})

	it('debe fallar si se ingresa un importe menor para la apuesta a pleno', async () => {
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '10')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('Debe apostar más de 10 $')
	})

	it('debe fallar si se ingresa un importe menor para la apuesta a docena', async () => {
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
		await user.type(screen.getByTestId('monto'), '50')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('Debe apostar más de 50 $')
	})

	it('debe indicar si gana el monto para la apuesta a pleno', async () => {
		vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '25')
		await user.selectOptions(screen.getByTestId('apuesta'), '5')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡ Ganaste $ 875 !!')
	})

	it('debe indicar si pierde para la apuesta a pleno', async () => {
		vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '25')
		await user.selectOptions(screen.getByTestId('apuesta'), '6')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡Perdiste!! Salió el 5')
	})

	it('debe indicar si gana el monto para la apuesta a docena', async () => {
		vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '100')
		await user.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
		await user.selectOptions(screen.getByTestId('apuesta'), 'Primera')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡ Ganaste $ 1100 !!')
	})

	it('debe indicar si pierde para la apuesta a docena', async () => {
		vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
		const user = userEvent.setup()
		render(ApuestaPage)
		await user.type(screen.getByTestId('monto'), '100')
		await user.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
		await user.selectOptions(screen.getByTestId('apuesta'), 'Tercera')
		await user.click(screen.getByTestId('btnApuesta'))
		expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡Perdiste!! Salió el 5')
	})

})
