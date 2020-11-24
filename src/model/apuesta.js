import Resultado from './resultado'
import { resultado } from '../stores/resultadoStore'

const PRIMERA = {
  toString: () => 'Primera',
  min: 1,
  max: 12,
}
const SEGUNDA = {
  toString: () => 'Segunda',
  min: 13,
  max: 24,
}
const TERCERA = {
  toString: () => 'Tercera',
  min: 25,
  max: 36,
}

export class TipoDeApuesta {
  validar(apuesta) {
    if (apuesta.monto < this.MINIMO_APUESTA) {
      throw `El monto mínimo de apuesta es $${this.MINIMO_APUESTA}`
    }
    if (apuesta.monto > this.MAXIMO_APUESTA) {
      throw `El monto máximo de apuesta es $${this.MAXIMO_APUESTA}`
    }
  }
}

export class Pleno extends TipoDeApuesta {
  constructor() {
    super()
    this.ganancia = 35
    this.descripcion = 'Pleno'
    this.MINIMO_APUESTA = 10
    this.MAXIMO_APUESTA = 50000
    this.valoresAApostar = [...Array(37).keys()]
  }

  esGanador(numeroGanador, valorApostado) {
    return numeroGanador === valorApostado
  }
}

export class Docena extends TipoDeApuesta {
  constructor() {
    super()
    this.ganancia = 11
    this.descripcion = 'Docena'
    this.valoresAApostar = [PRIMERA, SEGUNDA, TERCERA]
    this.MINIMO_APUESTA = 50
    this.MAXIMO_APUESTA = 100000
  }

  esGanador(numeroGanador, valorApostado) {
    return numeroGanador >= valorApostado.min && numeroGanador <= valorApostado.max
  }
}

export class Apuesta {
  constructor() {
    this.fecha = new Date()
    this.monto
    this.tipoApuesta = PLENO
    this.valorApostado
  }

  validarApuesta() {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (!this.fecha) {
      throw 'Debe ingresar una fecha de apuesta'
    }
    if (now.getTime() > this.fecha.getTime()) {
      throw 'Debe ingresar una fecha actual o posterior al día de hoy'
    }
    if (this.monto == null) {
      throw 'Debe ingresar un monto para apostar'
    }
    if (this.monto <= 0) {
      throw 'El monto a apostar debe ser positivo'
    }
    if (!this.tipoApuesta) {
      throw 'Debe ingresar tipo de apuesta'
    }
    if (this.valorApostado == null) {
      throw 'Debe ingresar valor a apostar'
    }
    this.tipoApuesta.validar(this)
  }

  apostar() {
    resultado.actualizar(null)
    this.validarApuesta()
    const numeroGanador = Math.floor(Math.random() * 37)
    let ganancia = 0
    if (this.tipoApuesta.esGanador(numeroGanador, this.valorApostado)) {
      ganancia = this.monto * this.tipoApuesta.ganancia
    }
    resultado.actualizar(new Resultado(numeroGanador, ganancia))
  }

  setFecha(fechaString) {
    var fecha = fechaString.split(/\D/)
    this.fecha = new Date(fecha[0], --fecha[1], fecha[2])
  }
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()
// export const apuesta = writable(new Apuesta())
