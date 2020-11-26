export default class Resultado {
  constructor(numeroGanador, montoAGanar, montoApostado) {
    this.numeroGanador = numeroGanador
    this.montoAGanar = montoAGanar
    this.montoApostado = montoApostado
  }

  gano() {
    return this.montoAGanar > 0
  }

  get ganancia() {
    return this.montoAGanar - this.montoApostado
  }

  valor() {
    if (this.gano()) {
      return '¡¡ Ganaste $' + this.ganancia + ' !!'
    } else {
      return '¡¡Perdiste!! Salió el ' + this.numeroGanador
    }
  }
}
