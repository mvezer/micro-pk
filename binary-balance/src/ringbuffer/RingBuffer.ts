export default class RingBuffer<T> {
  #data: Array<T> = []
  #capacity: number 
  #readIndex: number
  #writeIndex: number

  constructor (capacity: number) {
    this.#capacity = capacity
    this.#readIndex = 0
    this.#writeIndex = 0
    this.#data = new Array<T>(this.#capacity)
  }

  public add (value: T): void {
    this.#data[this.#writeIndex % this.#capacity] = value
    this.#writeIndex += 1
  }

  public read(): T | undefined {
    if (this.#writeIndex - this.#readIndex > this.#capacity) {
      return undefined
    }
    if (this.#readIndex >= this.#writeIndex) {
      return undefined
    }
    const value = this.#data[this.#readIndex % this.#capacity]
    this.#readIndex += 1
    return value;
  }

  public readRange (range: number): Array<T> | undefined {
    if (range > this.#writeIndex - this.#readIndex) {
      return undefined
    }

    const rangeStartIndex: number = this.#readIndex - range
    const result = new Array<T>(range)
    for (let i = 0; i < range; i += 1) {
      result[i] = this.#data[(i + rangeStartIndex) % this.#capacity]
    }

    return result
  }

  get availableItems (): number {
    return this.#writeIndex - this.#readIndex
  }

  get readIndex (): number {
    return this.#readIndex
  }

  set readIndex (index: number) {
    if (index < this.#writeIndex) {
      this.#readIndex = index
    }
  }
}
