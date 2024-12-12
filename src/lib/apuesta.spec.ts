import dayjs from 'dayjs'
import { Apuesta, DOCENA, PLENO } from './apuesta.svelte'
import { describe, expect, it } from 'vitest'

describe('Apuesta', () => {
  it('apuesta valida pasa validaciones ok', () => {
    const apuestaOk = new Apuesta()
    apuestaOk.fecha = new Date()
    apuestaOk.monto = 60
    apuestaOk.tipoApuesta = PLENO
    apuestaOk.valorApostado = 3
    apuestaOk.validarApuesta()
    expect(true).toBeTruthy()
  })
  it('apuesta sin fecha tira error', () => {
    const apuestaSinFecha = new Apuesta()
    apuestaSinFecha.validarApuesta()
    expect(apuestaSinFecha.errorsFrom('fecha')).toBe('Debe ingresar una fecha de apuesta')
  })
  it('apuesta con fecha anterior a la del día de hoy tira error', () => {
    const apuestaFechaAnterior = new Apuesta()
    apuestaFechaAnterior.fecha = dayjs().subtract(1, 'day').toDate()
    apuestaFechaAnterior.validarApuesta()
    expect(apuestaFechaAnterior.errorsFrom('fecha')).toBe(
      'Debe ingresar una fecha actual o posterior al día de hoy'
    )
  })
  it('apuesta con monto negativo tira error', () => {
    const apuestaMontoNegativo = new Apuesta()
    apuestaMontoNegativo.fecha = new Date()
    apuestaMontoNegativo.monto = -20
    apuestaMontoNegativo.tipoApuesta = null
    apuestaMontoNegativo.validarApuesta()
    expect(apuestaMontoNegativo.errorsFrom('monto')).toBe('El monto a apostar debe ser positivo')
    apuestaMontoNegativo.tipoApuesta = PLENO
    apuestaMontoNegativo.validarApuesta()
    expect(apuestaMontoNegativo.errorsFrom('monto')).toBe(
      'El monto a apostar debe ser positivo. Debe apostar más de 10 $'
    )
  })
  it('apuesta sin tipo de apuesta tira error', () => {
    const apuestaSinTipoApuesta = new Apuesta()
    apuestaSinTipoApuesta.fecha = new Date()
    apuestaSinTipoApuesta.monto = 40
    apuestaSinTipoApuesta.tipoApuesta = null
    apuestaSinTipoApuesta.validarApuesta()
    expect(apuestaSinTipoApuesta.errorsFrom('tipoApuesta')).toBe('Debe ingresar tipo de apuesta')
  })
  it('apuesta sin valor apostado tira error', () => {
    const apuestaSinValorApostado = new Apuesta()
    apuestaSinValorApostado.fecha = new Date()
    apuestaSinValorApostado.monto = 5
    apuestaSinValorApostado.tipoApuesta = PLENO
    apuestaSinValorApostado.validarApuesta()
    expect(apuestaSinValorApostado.hasErrors('valorAApostar')).toBeTruthy()
    expect(apuestaSinValorApostado.errorsFrom('valorAApostar')).toBe(
      'Debe ingresar valor a apostar'
    )
  })
  it('apuesta pleno con poco monto tira error', () => {
    const apuestaPleno = new Apuesta()
    apuestaPleno.fecha = new Date()
    apuestaPleno.monto = 10
    apuestaPleno.tipoApuesta = PLENO
    apuestaPleno.valorApostado = 2
    apuestaPleno.validarApuesta()
    expect(apuestaPleno.errorsFrom('monto')).toBe('Debe apostar más de 10 $')
  })
  it('apuesta docena con poco monto tira error', () => {
    const apuestaPleno = new Apuesta()
    apuestaPleno.fecha = new Date()
    apuestaPleno.monto = 50
    apuestaPleno.tipoApuesta = DOCENA
    apuestaPleno.valorApostado = 2
    apuestaPleno.validarApuesta()
    expect(apuestaPleno.errorsFrom('monto')).toBe('Debe apostar más de 50 $')
  })
})