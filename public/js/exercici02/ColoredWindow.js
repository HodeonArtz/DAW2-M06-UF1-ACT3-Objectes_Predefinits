import random from "../myAPI/random.js";

/**
 * Esta clase genera una instancia de una ventana al que se le puede indicar el color,
 * qué tiene que ocurrir cuando se clica, etc.
 *
 * @export
 * @class ColoredWindow
 */
export default class ColoredWindow {
  /**
   * Lista de colores disponibles.
   *
   * @static
   * @type {Array}
   */
  static #WINDOW_COLORS = ["Amarillo", "Verde", "Cian", "Morado"];

  /**
   * Tamaño de la ventana (anchura)
   *
   * @type {number}
   */
  #WIDTH_PX = 320;

  /**
   * Tamaño de la ventana (altura)
   *
   * @type {number}
   */
  #HEIGHT_PX = 160;

  /**
   * Función que se ejecuta cuando se clica la ventana
   *
   * @type {function}
   */
  handleOnClick;

  /**
   * Referencia de la ventana
   *
   * @type {Window}
   */
  #windowReference = null;

  /**
   * Color de la ventana
   *
   * @type {string}
   */
  #color;

  /**
   * Crea una nueva ventana con un color.
   *
   * @constructor
   * @param {function} handleOnClick Función que se ejecuta al clicar la ventana.
   * @param {boolean} [centered=false] Indicar si la ventana se centra en la pantalla
   * @param {string} [color=ColoredWindow.#WINDOW_COLORS[
   *       Math.round(random(0, ColoredWindow.#WINDOW_COLORS.length - 1))
   *     ]] Nombre del color
   */
  constructor(
    handleOnClick,
    centered = false,
    color = ColoredWindow.#WINDOW_COLORS[
      Math.round(random(0, ColoredWindow.#WINDOW_COLORS.length - 1))
    ]
  ) {
    if (centered) {
      this.posX = window.screen.width / 2;
      this.posY = window.screen.height / 2;
    }
    if (!centered) {
      this.posX = Math.round(random(0, screen.width));
      this.posY = Math.round(random(0, screen.height));
    }
    this.handleOnClick = handleOnClick;
    this.#color = color;
    this.open();
  }

  /**
   * Setea el color de la ventana
   * @param {string} color
   */
  setColor(color) {
    if (color !== this.#color) this.#color = color;

    if (this.#windowReference) {
      this.#windowReference.window.top.document.title = this.color;
      this.#windowReference.document.body.dataset.color =
        this.color.toLowerCase();
      this.#windowReference.document.querySelector(".color-name").textContent =
        this.color;
    }
  }

  /**
   * Setea un nuevo color aleatorio
   */
  setRandomColor() {
    this.setColor(
      ColoredWindow.#WINDOW_COLORS[
        Math.round(random(0, ColoredWindow.#WINDOW_COLORS.length - 1))
      ]
    );
  }

  /**
   * Abre la ventana con los datos actuales de la instancia
   */
  open() {
    this.close();
    this.#windowReference = window.open(
      "./colorWindow.html",
      "_blank",
      `fullscreen=no,height=${this.#HEIGHT_PX},width=${
        this.#WIDTH_PX
      },resizable=no,titlebar=yes,
    left=${this.posX - this.#WIDTH_PX / 2},top=${
        this.posY - this.#HEIGHT_PX / 2
      }`
    );

    try {
      this.#windowReference.addEventListener("load", () => {
        this.setColor(this.color);
        this.#windowReference.addEventListener("click", () => {
          if (this.#windowReference.document.hasFocus) this.handleOnClick(this);
        });
      });
    } catch (error) {
      alert(
        "Activa el permiso de ventanas emergentes para esta página para que funcione el juego."
      );
      console.error(
        "Activa el permiso de ventanas emergentes para esta página para que funcione el juego."
      );
      console.error(error);
    }
  }

  /**
   * Cierra la vetana.
   */
  close() {
    if (!this.#windowReference) return;
    this.#windowReference.close();
    this.#windowReference = null;
  }

  /**
   * Devuelve el nombre del color
   *
   * @readonly
   * @type {string}
   */
  get color() {
    return this.#color;
  }
}
