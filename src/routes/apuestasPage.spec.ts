import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ApuestaPage from './+page.svelte'
import { Apuesta } from '$lib/apuesta.svelte'
import { formatearFecha } from '$lib/utils'

describe('Apuestas page', () => {

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('debe fallar si se ingresa un importe negativo', async () => {
    render(ApuestaPage)
    await userEvent.type(screen.getByTestId('monto'), '-10')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('El monto a apostar debe ser positivo')
  })

  it('debe fallar si se ingresa un importe menor para la apuesta a pleno', async () => {
    render(ApuestaPage)
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Pleno')
    await userEvent.type(screen.getByTestId('monto'), '10')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('Debe apostar más de 10 $')
  })

  it('debe fallar si se ingresa un importe menor para la apuesta a docena', async () => {
    render(ApuestaPage)
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
    await userEvent.type(screen.getByTestId('monto'), '50')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('errorMessage-monto').innerHTML).toBe('Debe apostar más de 50 $')
  })

  it('debe indicar si gana el monto para la apuesta a pleno', async () => {
    vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
    render(ApuestaPage)
    await userEvent.type(screen.getByTestId('monto'), '25')
    await userEvent.type(screen.getByTestId('fechaApuesta'), formatearFecha(new Date()))
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Pleno')
    await userEvent.selectOptions(screen.getByTestId('apuesta'), '5')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡ Ganaste $ 875 !!')
  })

  it('debe indicar si pierde para la apuesta a pleno', async () => {
    vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
    render(ApuestaPage)
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Pleno')
    await userEvent.type(screen.getByTestId('fechaApuesta'), formatearFecha(new Date()))
    await userEvent.type(screen.getByTestId('monto'), '25')
    await userEvent.selectOptions(screen.getByTestId('apuesta'), '6')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡Perdiste!! Salió el 5')
  })

  it('debe indicar si gana el monto para la apuesta a docena', async () => {
    vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
    render(ApuestaPage)
    await userEvent.type(screen.getByTestId('fechaApuesta'), formatearFecha(new Date()))
    await userEvent.type(screen.getByTestId('monto'), '100')
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
    await userEvent.selectOptions(screen.getByTestId('apuesta'), 'Primera')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡ Ganaste $ 1100 !!')
  })

  it('debe indicar si pierde para la apuesta a docena', async () => {
    vi.spyOn(Apuesta.prototype, 'obtenerNumeroGanador').mockImplementation(() => 5)
    render(ApuestaPage)
    await userEvent.type(screen.getByTestId('fechaApuesta'), formatearFecha(new Date()))
    await userEvent.type(screen.getByTestId('monto'), '100')
    await userEvent.selectOptions(screen.getByTestId('tipoApuesta'), 'Docena')
    await userEvent.selectOptions(screen.getByTestId('apuesta'), 'Tercera')
    await userEvent.click(screen.getByTestId('btnApuesta'))
    expect(screen.getByTestId('resultado').innerHTML).toBe('¡¡Perdiste!! Salió el 5')
  })

})