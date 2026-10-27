// Compares plugin versions such as "5.3", "5.3.1" and "2.62" part by part.
// Missing parts count as 0, so "5.3" and "5.3.0" are equal.
export function compareVersions(a: string, b: string): number {
  const left = a.split(/[.\-+_]/)
  const right = b.split(/[.\-+_]/)

  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const leftPart = left[index] ?? '0'
    const rightPart = right[index] ?? '0'
    const leftNumber = Number(leftPart)
    const rightNumber = Number(rightPart)

    if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) {
      const comparison = leftPart.localeCompare(rightPart)

      if (comparison !== 0) {
        return comparison
      }
    } else if (leftNumber !== rightNumber) {
      return leftNumber < rightNumber ? -1 : 1
    }
  }

  return 0
}

export function isNewerVersion(candidate: string, current: string): boolean {
  return compareVersions(candidate, current) > 0
}
