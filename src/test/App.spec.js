import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/svelte'
import App from '../components/App'

test('no lleno nada', async () => {
  const { getByTestId } = render(App)
  const monto = getByTestId('monto_input')
  const boton = getByTestId('boton_apostar')

  fireEvent.input(monto, { target: { value: null } })

  await fireEvent.click(boton)

  expect(getByTestId(`error`)).toHaveTextContent(`Debe ingresar un monto para apostar`)
})

test('pongo monto negativo', async () => {
  const { getByTestId } = render(App)
  const monto = getByTestId('monto_input')
  const boton = getByTestId('boton_apostar')

  fireEvent.input(monto, { target: { value: -10 } })

  await fireEvent.click(boton)

  expect(getByTestId(`error`)).toHaveTextContent('El monto a apostar debe ser positivo')
})
