import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/svelte'
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
    ({ getByTestId, queryByTestId } = render(App))

    montoInput = getByTestId('monto_input')
    botonApostar = getByTestId('boton_apostar')
    tipoDeApuestaSelect = getByTestId('tipo_de_apuesta_select')
  })

  describe('Validaciones generales', () => {
    test('no se puede apostar si no se ingresa un monto a apostar', () => {
      userEvent.clear(montoInput)

      userEvent.click(botonApostar)

      expectError(`Debe ingresar un monto para apostar`)
    })

    test('no se puede apostar un monto negativo', () => {
      userEvent.type(montoInput, '-10')

      userEvent.click(botonApostar)

      expectError('El monto a apostar debe ser positivo')
    })

    test('no se puede apostar 0 de monto', () => {
      userEvent.type(montoInput, '0')

      userEvent.click(botonApostar)

      expectError('El monto a apostar debe ser positivo')
    })
  })

  describe('Pleno', () => {
    let opcionPleno
    const minimo = PLENO.MINIMO_APUESTA
    const maximo = PLENO.MAXIMO_APUESTA

    beforeEach(() => {
      opcionPleno = getByTestId('opcion_pleno')
      userEvent.selectOptions(tipoDeApuestaSelect, [opcionPleno])
    })

    test('no se puede apostar menos del monto mínimo', () => {
      userEvent.type(montoInput, `${minimo - 1}`)
      userEvent.click(botonApostar)

      expectError(`El monto mínimo de apuesta es $${minimo}`)
    })
    test('se puede apostar el monto mínimo', () => {
      userEvent.type(montoInput, `${minimo}`)

      userEvent.click(botonApostar)

      expectResultado()
    })

    test('no se puede apostar un monto superior al máximo', () => {
      userEvent.type(montoInput, `${maximo + 1}`)

      userEvent.click(botonApostar)

      expectError(`El monto máximo de apuesta es $${maximo}`)
    })

    test('se puede apostar el monto máximo', () => {
      userEvent.type(montoInput, `${maximo}`)

      userEvent.click(botonApostar)

      expectResultado()
    })

    test('se puede apostar un monto entre el mínimo y el máximo', () => {
      userEvent.type(montoInput, `${minimo + 1}`)

      userEvent.click(botonApostar)

      expectResultado()
    })
  })

  describe('Docena', () => {
    let opcionDocena
    const minimo = DOCENA.MINIMO_APUESTA
    const maximo = DOCENA.MAXIMO_APUESTA
    beforeEach(() => {
      opcionDocena = getByTestId('opcion_docena')

      userEvent.selectOptions(tipoDeApuestaSelect, [opcionDocena])
    })

    test('no se puede apostar menos del monto mínimo', () => {
      userEvent.type(montoInput, `${minimo - 1}`)

      userEvent.click(botonApostar)

      expectError(`El monto mínimo de apuesta es $${minimo}`)
    })
    test('se puede apostar el monto mínimo', () => {
      userEvent.type(montoInput, `${minimo}`)

      userEvent.click(botonApostar)

      expectResultado()
    })

    test('se puede apostar el monto máximo', () => {
      userEvent.type(montoInput, `${maximo}`)

      userEvent.click(botonApostar)

      expectResultado()
    })

    test('no se puede apostar un monto superior al máximo', () => {
      userEvent.type(montoInput, `${maximo + 1}`)

      userEvent.click(botonApostar)

      expectError(`El monto máximo de apuesta es $${maximo}`)
    })

    test('se puede apostar un monto entre el mínimo y el máximo', () => {
      userEvent.type(montoInput, `${minimo + 1}`)

      userEvent.click(botonApostar)

      expectResultado()
    })
  })
})

const expectError = async (mensaje) => await waitFor(() => expect(getByTestId(`error`)).toHaveTextContent(mensaje))

const expectResultado = async () => {
  await waitFor(() => expect(queryByTestId(`error`)).toBeNull())
  expect(getByTestId(`resultado`)).toBeInTheDocument()
}
