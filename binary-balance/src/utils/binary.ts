import { bit, uint8 } from '../types/integers'

export const onesRate = (bits: bit[]): number => {
  const onesCount = bits.reduce((count: number, currentBit: bit) => {
    return currentBit === 1 ? count + 1 : count
  }, 0)

  return onesCount / bits.length
}

export const extractBit = (byte: uint8, bitOffset: number): bit => {
  if (bitOffset > 7 || bitOffset < 0) {
    throw new Error(`The bit offset (${bitOffset}) is out of range [0..7]`)
  }
  return !!(byte & 1 << bitOffset) ? 1 : 0
}

export const byteToBits = (byte: uint8, reversedBitOrder = false): bit[] => {
  const bits: Array<bit> = new Array<bit>(8)
  for (let bitOffset = 0; bitOffset < 8; bitOffset += 1) {
    bits[reversedBitOrder ? 7 - bitOffset : bitOffset] = extractBit(byte, bitOffset)
  }

  return bits
}
