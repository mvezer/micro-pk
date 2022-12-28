import { uint8 } from '../types/integers'
import IRandomNumberProvider from './IRandomNumberProvider'

const MAXIMUM_BYTES_COUNT_PER_REQUEST = 1024
const REQUEST_RATE = 100

export default class PseudoRandomNumberProvider implements IRandomNumberProvider {
  async getRandomBytes (bytesCount: number): Promise<uint8[]> {
    const bytes = new Array<uint8>(bytesCount)
    for (let i = 0; i < bytesCount; i += 1) {
      bytes[i] = Math.round(Math.random() * 255) as uint8
    }
    return bytes
  }

  get maxBytesCountPerRequest (): number {
    return MAXIMUM_BYTES_COUNT_PER_REQUEST
  }

  get requestRate (): number {
    return REQUEST_RATE
  }
}
