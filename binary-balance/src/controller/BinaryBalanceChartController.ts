import RingBuffer from '../ringbuffer/RingBuffer'
import { uint8, bit } from '../types/integers'
import { byteToBits, onesRate } from '../utils/binary'
import IRandomNumberProvider from '../random-number-providers/IRandomNumberProvider'
import { plot, PlotConfig } from 'asciichart'
import { box, screen, Widgets } from 'blessed'

const DEFAULT_RING_BUFFER_CAPACITY = 8192
const DEFAULT_PROCESSING_RATE = 2
const BITS_SAMPLING_RANGE = 20

export interface IBinaryBalanceChartControllerParameters {
  readonly randomNumberProvider: IRandomNumberProvider
  readonly bufferCapacity?: number
  readonly processingRate?: number
}

export default class BinaryBalanceChartController {
  #binaryBuffer: RingBuffer<bit>
  #onesRateBuffer: RingBuffer<number> | undefined
  #randomNumberProvider: IRandomNumberProvider
  #processingRate: number
  #box: Widgets.BoxElement | undefined
  #screen: Widgets.Screen | undefined
  #timer: NodeJS.Timer | undefined

  constructor (params: IBinaryBalanceChartControllerParameters) {
    this.#randomNumberProvider = params.randomNumberProvider
    this.#binaryBuffer = new RingBuffer<bit>(params.bufferCapacity || DEFAULT_RING_BUFFER_CAPACITY)
    this.#processingRate = params.processingRate || DEFAULT_PROCESSING_RATE
  }

  async getBytes (count?: number): Promise<void> {
    // TODO handle the case when the bytesNeeded exceeeds this.#randomNumberProvider.maxBytesCountPerRequest
    (await this.#randomNumberProvider.getRandomBytes(count || Math.ceil(BITS_SAMPLING_RANGE / 8)))
      .reduce((bits: Array<bit>, byte: uint8) => {
        return bits.concat(byteToBits(byte))
      }, [])
      .forEach(this.#binaryBuffer.add.bind(this.#binaryBuffer))
  }

  async start (): Promise<void> {
    await this.getBytes(Math.ceil(BITS_SAMPLING_RANGE / 8 * 3))
    this.#binaryBuffer.readIndex = BITS_SAMPLING_RANGE
    this.#timer = setInterval(this.step.bind(this), 1 / this.#processingRate * 1000)
    this.#screen = screen({
      smartCSR: true,
      title: 'Binary balance'
    })

    this.#box = box({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '50%',
      content: 'Buffering...',
      tags: true,
      border: {
        type: 'line'
      },
    })
    this.#screen.append(this.#box)
    this.#box.content = String(this.#box.width || '')
    this.#box.focus()
    this.#box.key('enter', () => {
      this.stop()
      process.exit(0)
    })
    this.#screen.render()
  }

  stop (): void {
    if (this.#timer) {
      clearInterval(this.#timer)
      this.#timer = undefined
    }
  }

  async step (): Promise<void> {
    this.#binaryBuffer.read()
    const bits: bit[] = this.#binaryBuffer.readRange(BITS_SAMPLING_RANGE)!
    // console.log(onesRate(bits))
    if (this.#binaryBuffer.availableItems < BITS_SAMPLING_RANGE * 2) {
      await this.getBytes(BITS_SAMPLING_RANGE * 2)
    }
    this.#box!.content = `Current value ${onesRate(bits)}`
    this.#screen?.render()
  }
}
