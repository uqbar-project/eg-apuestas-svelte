export class Resultado {
  numeroGanador: number
  montoAGanar: number

  constructor(numeroGanador: number, montoAGanar: number) {
    this.numeroGanador = numeroGanador
    this.montoAGanar = montoAGanar
  }

  gano() {
    return this.montoAGanar > 0
  }

  valor() {
    return this.gano()
      ? `¡¡ Ganaste $ ${this.montoAGanar} !!`
      : `¡¡Perdiste!! Salió el ${this.numeroGanador}`
  }
}
