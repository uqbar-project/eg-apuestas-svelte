import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import App from '../components/App'
import { Docena, DOCENA, PLENO } from '../model/apuesta'

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

      expect(getByTestId(`error`)).toHaveTextContent('El monto a apostar debe ser positivo')
    })

    test('no se puede apostar 0 de monto', async () => {
      fireEvent.input(montoInput, { target: { value: 0 } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent('El monto a apostar debe ser positivo')
    })
  })

  describe('Pleno', () => {
    let opcionPleno
    beforeEach(() => {
      opcionPleno = getByTestId('opcion_pleno')
      userEvent.selectOptions(tipoDeApuestaSelect, [opcionPleno])
    })

    test('no se puede apostar menos del monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: PLENO.MINIMO_APUESTA - 1 } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent(`El monto mínimo de apuesta es $${PLENO.MINIMO_APUESTA}`)
    })
    test('se puede apostar el monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: PLENO.MINIMO_APUESTA } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })

    test('no se puede apostar un monto superior al máximo', async () => {
      fireEvent.input(montoInput, { target: { value: PLENO.MAXIMO_APUESTA + 1 } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent(`El monto máximo de apuesta es $${PLENO.MAXIMO_APUESTA}`)
    })

    test('se puede apostar el monto máximo', async () => {
      fireEvent.input(montoInput, { target: { value: PLENO.MAXIMO_APUESTA } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })

    test('se puede apostar un monto entre el mínimo y el máximo', async () => {
      fireEvent.input(montoInput, { target: { value: PLENO.MINIMO_APUESTA + 1 } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })
  })

  describe('Docena', () => {
    let opcionDocena
    beforeEach(() => {
      opcionDocena = queryByTestId('opcion_docena')

      userEvent.selectOptions(tipoDeApuestaSelect, [opcionDocena])
    })

    test('no se puede apostar menos del monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: DOCENA.MINIMO_APUESTA - 1 } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent(`El monto mínimo de apuesta es $${DOCENA.MINIMO_APUESTA}`)
    })
    test('se puede apostar el monto mínimo', async () => {
      fireEvent.input(montoInput, { target: { value: DOCENA.MINIMO_APUESTA } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })

    test('se puede apostar el monto máximo', async () => {
      fireEvent.input(montoInput, { target: { value: DOCENA.MAXIMO_APUESTA } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })

    test('no se puede apostar un monto superior al máximo', async () => {
      fireEvent.input(montoInput, { target: { value: DOCENA.MAXIMO_APUESTA + 1 } })

      await fireEvent.click(botonApostar)

      expect(getByTestId(`error`)).toHaveTextContent(`El monto máximo de apuesta es $${DOCENA.MAXIMO_APUESTA}`)
    })

    test('se puede apostar un monto entre el mínimo y el máximo', async () => {
      fireEvent.input(montoInput, { target: { value: DOCENA.MINIMO_APUESTA + 1 } })

      await fireEvent.click(botonApostar)

      expect(queryByTestId(`error`)).not.toBeInTheDocument()

      expect(getByTestId(`resultado`)).toBeInTheDocument()
    })
  })
})
