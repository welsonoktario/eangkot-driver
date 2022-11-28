/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
export const forHumans = (seconds: number): string => {
  const levels = [
    [Math.floor(((seconds % 31536000) % 86400) / 3600), 'jam'],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'menit'],
  ]
  let returntext = ''

  for (let i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue
    returntext +=
      ' ' +
      levels[i][0] +
      ' ' +
      (levels[i][0] === 1
        ? (levels[i][1] as string).substring(
            0,
            (levels[i][1] as string).length - 1
          )
        : levels[i][1])
  }
  return returntext.trim()
}
