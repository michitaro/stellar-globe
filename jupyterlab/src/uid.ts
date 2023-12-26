let serial = 0

export function uid() {
  return `uid-${++serial}`
}
