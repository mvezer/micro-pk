import RingBuffer from './RingBuffer'

describe('Test ring buffer', () => {
  let ringBuffer: RingBuffer<number>

  beforeEach(() => {
    ringBuffer = new RingBuffer(5)
  })

  it('add and read elements', () => {
    ringBuffer.add(1)
    ringBuffer.add(2)
    ringBuffer.add(3)
    ringBuffer.add(4)
    ringBuffer.add(5)
    expect(ringBuffer.read()).toEqual(1)
    expect(ringBuffer.read()).toEqual(2)
    ringBuffer.add(6)
    expect(ringBuffer.read()).toEqual(3)
    ringBuffer.add(7)
    expect(ringBuffer.read()).toEqual(4)
    expect(ringBuffer.read()).toEqual(5)
    expect(ringBuffer.read()).toEqual(6)
    expect(ringBuffer.read()).toEqual(7)

    // test read failure at the end of data
    expect(ringBuffer.read()).toBeUndefined()
  })

  it('range read', () => {
    ringBuffer.add(1)
    ringBuffer.add(2)
    ringBuffer.add(3)
    ringBuffer.add(4)
    ringBuffer.add(5)
    expect(ringBuffer.read()).toEqual(1)
    expect(ringBuffer.read()).toEqual(2)
    expect(ringBuffer.read()).toEqual(3)
    expect(ringBuffer.readRange(2)).toEqual([2,3])


    ringBuffer.add(6)
    ringBuffer.add(7)

    expect(ringBuffer.read()).toEqual(4)
    expect(ringBuffer.read()).toEqual(5)
    expect(ringBuffer.read()).toEqual(6)
    expect(ringBuffer.read()).toEqual(7)
    expect(ringBuffer.readRange(3)).toEqual([5,6,7])

    // test if we try to read more than the capacity of the buffer
    expect(ringBuffer.readRange(10)).toBeUndefined()
  })
})
