import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import App from '../components/App'
import { DOCENA, PLENO } from '../model/apuesta'

let getByTestId
let queryByTestId
let montoInput
let botonApostar
let tipoDeApuestaSelect
describe('Apuesta', () => {
  beforeEach(() => {
    ;({ getByTestId, queryByTestId } = render(App))

    montoInput = getByTestId('monto_input')
    botonApostar = getByTestId('boton_apostar')
    tipoDeApuestaSelect = getByTestId('tipo_de_apuesta_select')
  })

  describe('Validaciones generales', () => {
    test('no se puede apostar si no se ingresa un monto a apostar', async () => {
      fireEvent.input(montoInput, { target: { value: null } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent(`Debe ingresar un monto para apostar`)
    })

    test('no se puede apostar un monto negativo', async () => {
      fireEvent.input(montoInput, { target: { value: -10 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoNoPositivo()
    })

    test('no se puede apostar 0 de monto', async () => {
      fireEvent.input(montoInput, { target: { value: 0 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoNoPositivo()
    })
  })

  describe('Pleno', () => {
    let opcionPleno
    let minimo = PLENO.MINIMO_APUESTA
    let maximo = PLENO.MAXIMO_APUESTA

    beforeEach(() => {
      opcionPleno = getByTestId('opcion_pleno')
      userEvent.selectOptions(tipoDeApuestaSelect, [opcionPleno])
    })

    test('no se puede apostar menos del monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo - 1 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoMinimo(minimo)
    })
    test('se puede apostar el monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })

    test('no se puede apostar un monto superior al máximo', async () => {
      fireEvent.input(montoInput, { target: { value: maximo + 1 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoMaximo(maximo)
    })

    test('se puede apostar el monto máximo', async () => {
      fireEvent.input(montoInput, { target: { value: maximo } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })

    test('se puede apostar un monto entre el mínimo y el máximo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo + 1 } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })
  })

  describe('Docena', () => {
    let opcionDocena
    let minimo = DOCENA.MINIMO_APUESTA
    let maximo = DOCENA.MAXIMO_APUESTA
    beforeEach(() => {
      opcionDocena = queryByTestId('opcion_docena')

      userEvent.selectOptions(tipoDeApuestaSelect, [opcionDocena])
    })

    test('no se puede apostar menos del monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo - 1 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoMinimo(minimo)
    })
    test('se puede apostar el monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })

    test('se puede apostar el monto máximo', async () => {
      fireEvent.input(montoInput, { target: { value: maximo } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })

    test('no se puede apostar un monto superior al máximo', async () => {
      fireEvent.input(montoInput, { target: { value: maximo + 1 } })

      await fireEvent.click(botonApostar)

      expectErrorMontoMaximo(maximo)
    })

    test('se puede apostar un monto entre el mínimo y el máximo', async () => {
      fireEvent.input(montoInput, { target: { value: minimo + 1 } })

      await fireEvent.click(botonApostar)

      expectResultado()
    })
  })
})

const expectError = (mensaje) => expect(getByTestId(`error`)).toHaveTextContent(mensaje)

const expectErrorMontoNoPositivo = () => expectError('El monto a apostar debe ser positivo')

const expectErrorRangoMonto = (nombre, valor) => expectError(`El monto ${nombre} de apuesta es $${valor}`)

const expectErrorMontoMinimo = (valor) => expectErrorRangoMonto('mínimo', valor)

const expectErrorMontoMaximo = (valor) => expectErrorRangoMonto('máximo', valor)

const expectResultado = () => {
  expect(queryByTestId(`error`)).not.toBeInTheDocument()
  expect(getByTestId(`resultado`)).toBeInTheDocument()
}
