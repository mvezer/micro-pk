import { byteToBits, onesRate } from './binary'
describe('Test binary utils', () => {
  it('test byte-to-bits conversion', () => {
    expect(byteToBits(42)).toEqual([0,1,0,1,0,1,0,0])
    expect(byteToBits(42, true)).toEqual([0,0,1,0,1,0,1,0])
    expect(byteToBits(173)).toEqual([1,0,1,1,0,1,0,1])
    expect(byteToBits(173, true)).toEqual([1,0,1,0,1,1,0,1])
  })

  it('test ones rate calculation', () => {
    expect(onesRate([0,0,1,1,0,1,1,0])).toEqual(0.5)
    expect(onesRate([0,0,1,0])).toEqual(0.25)
    expect(onesRate([0,0,0,0])).toEqual(0)
    expect(onesRate([1,1,1,1])).toEqual(1)
  })
})
