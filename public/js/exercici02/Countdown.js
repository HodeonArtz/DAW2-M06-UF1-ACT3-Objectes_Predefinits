/**
 * Crea un cuenta atrás de manera asíncrona.
 */
export default class Countdown {
  /**
   * Referencia al Interval del cuenta atrás.
   *
   * @type {number | null}
   */
  #interval = null;

  /**
   * Tiempo inicio del cuenta atrás.
   *
   * @type {number}
   */
  #countdownTime = 0;

  /**
   * Tiempo actual del cuenta atrás.
   * @type {number}
   */
  #remainingTime = 0;

  /**
   *
   * @param {number} countdownTime Indica el tiempo inicio del cuenta atrás
   */
  constructor(countdownTime) {
    this.#countdownTime = countdownTime;
    this.#remainingTime = countdownTime;
  }

  /**
   * Detiene el cuenta atrás y lo deja en el tiempo inicial
   * @see {@link Countdown.#countdownTime}
   */
  stop() {
    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = null;
    }
    this.#remainingTime = this.#countdownTime;
  }
  /**
   *  Inicia el contador
   * @param {function} handleOnUpdate función que se ejecuta en cada intervalo
   * @param {function} handleOnEnd función que se ejecuta cuando termina el cuenta atrás
   */
  start(handleOnUpdate, handleOnEnd) {
    const pastTime = Date.now();
    this.#interval = setInterval(() => {
      const currentTime = Date.now(),
        countdownInfo = {
          remainingTime: this.#remainingTime.toFixed(2),
          countdownTime: this.#countdownTime,
        };

      this.#remainingTime = +(
        this.#countdownTime -
        (currentTime - pastTime) / 1000
      ).toFixed(2);

      handleOnUpdate(countdownInfo);

      if (this.#remainingTime >= 0) return;

      handleOnEnd();
      this.stop();
    }, 50);
  }

  /**
   * Consigue el tiempo actual del cuenta atrás en segundos.milisegundos
   *
   * @readonly
   * @type {number}
   */
  get remainingTime() {
    return this.#remainingTime.toFixed(2);
  }
}
