export const getPathFromKey = (
  path: string,
  obj?: Record<string, unknown>
): Array<string | number> => {
  const match = path.match(/\[(\d+)\]/)
  let p: Array<string | number> = path.split('.')
  if (match) {
    // array
    const parts = path.split(match[0] + '.')
    // support only first level arrays
    if (obj && !Array.isArray(obj[parts[0]])) {
      obj[parts[0]] = []
    }
    p = [parts[0], Number(match[1]), ...parts.slice(1)]
  }
  return p
}
