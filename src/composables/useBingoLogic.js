export function useBingoLogic() {
  /**
   * Determina la letra del Bingo basada en el número de la balota.
   * @param {number|string} ballNumber - El número de la balota (1-75).
   * @returns {string} La letra correspondiente en minúscula (b, i, n, g, o).
   */
  const getColumnLetter = (ballNumber) => {
    if (!ballNumber) return ""
    const n = Number(ballNumber)
    if (n >= 1 && n <= 15) return "b"
    if (n >= 16 && n <= 30) return "i"
    if (n >= 31 && n <= 45) return "n"
    if (n >= 46 && n <= 60) return "g"
    if (n >= 61 && n <= 75) return "o"
    return ""
  }

  return {
    getColumnLetter,
  }
}
