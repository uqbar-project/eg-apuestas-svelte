import { writable } from 'svelte/store'

function crearResultado() {
  const { subscribe, update } = writable(null)

  return {
    subscribe,
    actualizar: (resultado) => update((n) => resultado),
  }
}

export const resultado = crearResultado()
