import BinaryBalanceChartController from './controller/BinaryBalanceChartController'
import PseudoRandomNumberProvider from './random-number-providers/PseudoRandomNumberProvider'

const main = async (): Promise<void> => {
  console.log('Hello')
  const controller = new BinaryBalanceChartController({ randomNumberProvider: new PseudoRandomNumberProvider() })
  await controller.start()
}

(async () => await main())()
