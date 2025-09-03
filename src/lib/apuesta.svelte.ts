import dayjs from 'dayjs'
import { Resultado } from './resultado'

export const MONTO_MINIMO_PLENO = 10

class Pleno {
  ganancia = 35
  descripcion = 'Pleno'
  valoresAApostar = Array.from(new Array(36), (value, index) => index + 1)

  validar(apuesta: Apuesta) {
    if (apuesta.monto <= MONTO_MINIMO_PLENO) {
      apuesta.addError('monto', `Debe apostar más de ${MONTO_MINIMO_PLENO} $`)
    }
  }

  esGanador(numeroGanador: number, valorApostado: number) {
    return numeroGanador === valorApostado
  }
}

class Docena {
  ganancia = 11
  descripcion = 'Docena'
  valoresAApostar = ['Primera', 'Segunda', 'Tercera']

  validar(apuesta: Apuesta) {
    if (apuesta.monto <= 50) {
      apuesta.addError('monto', 'Debe apostar más de 50 $')
    }
  }

  esGanador(numeroGanador: number, valorApostado: string) {
    const docena = this.valoresAApostar.indexOf(valorApostado)
    const min = docena * 12 + 1
    const max = (docena + 1) * 12
    return numeroGanador >= min && numeroGanador <= max
  }
}

export type TipoApuesta = {
	esGanador(numeroGanador: number, valorApostado: number | string | null): boolean
	validar(apuesta: Apuesta): void
	get ganancia(): number
	get valoresAApostar(): (number | string)[]
}

export const PLENO = new Pleno()
export const DOCENA = new Docena()

export class ValidationMessage {
  constructor(
		public field: string,
		public message: string
  ) { }
}

export class Apuesta {
  fecha: Date | null = null
  monto = 0
  tipoApuesta: TipoApuesta | null = null
  valorApostado: number | string | null = null
  resultado: Resultado | null = null
  errors: ValidationMessage[] = []

  hasErrors(field: string): boolean {
    return this.errors.some((_) => _.field == field)
  }

  errorsFrom(field: string) {
    return this.errors
      .filter((_) => _.field == field)
      .map((_) => _.message)
      .join('. ')
  }

  addError(field: string, message: string) {
    this.errors.push(new ValidationMessage(field, message))
  }

  validarApuesta() {
    this.errors.length = 0 // TODO: add a helper function
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (!this.fecha) {
      this.addError('fecha', 'Debe ingresar una fecha de apuesta')
    }
    if (dayjs(now).isAfter(dayjs(this.fecha))) {
      this.addError('fecha', 'Debe ingresar una fecha actual o posterior al día de hoy')
    }
    if (this.monto <= 0) {
      this.addError('monto', 'El monto a apostar debe ser positivo')
    }
    if (!this.tipoApuesta) {
      this.addError('tipoApuesta', 'Debe ingresar tipo de apuesta')
    } else {
      this.tipoApuesta.validar(this)
    }
    if (!this.valorApostado) {
      this.addError('valorAApostar', 'Debe ingresar valor a apostar')
    }
  }

  apostar() {
    this.resultado = null
    this.validarApuesta()
    if (this.errors.length > 0) return
    const numeroGanador = this.obtenerNumeroGanador()
    const ganancia = this.calcularGanancia(numeroGanador)
    this.resultado = new Resultado(numeroGanador, ganancia)
  }

  obtenerNumeroGanador(): number {
    return Math.floor(Math.random() * 37)
  }

  calcularGanancia(numeroGanador: number) {
    return this.tipoApuesta?.esGanador(numeroGanador, this.valorApostado)
      ? this.monto * this.tipoApuesta.ganancia
      : 0
  }
}
