import { uint8 } from '../types/integers'

export default interface IRandomNumberProvider {
  getRandomBytes (bytesCount: number): Promise<Array<uint8>>
  maxBytesCountPerRequest: number
  requestRate: number
}
