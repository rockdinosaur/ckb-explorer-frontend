import { fetchStatisticsChart } from '../http/fetcher'
import { AppDispatch, PageActions } from '../../contexts/providers/reducer'
import { fetchCachedData, storeCachedData } from '../../utils/cached'
import { CachedKeys } from '../../utils/const'

export interface StatisticsData {
  blockNumber: number
  type: 'Difficulty' | 'HashRate' | 'EpochNumber'
  difficulty?: number
  hashRate?: number
  epochNumber?: number
}

const findDifficulty = (
  difficulties: { difficulty: number; block_number: number; epoch_number: number }[],
  blockNumber: number,
) => {
  if (difficulties && difficulties.length > 0) {
    const result = difficulties.find(difficulty => {
      return difficulty.block_number === blockNumber
    })
    return result || undefined
  }
  return undefined
}

const handleStatistics = (wrapper: Response.Wrapper<State.StatisticsChart>) => {
  const { hash_rate: hashRates, difficulty: difficulties } = wrapper.attributes
  if (!hashRates && !difficulties) return []

  const datas: StatisticsData[] = []
  if (hashRates && hashRates.length > 0) {
    hashRates.forEach(hashRate => {
      datas.push({
        type: 'HashRate',
        blockNumber: hashRate.block_number,
        hashRate: Number((Number(hashRate.hash_rate) * 1000).toFixed(0)),
      })
      const difficulty = findDifficulty(difficulties, hashRate.block_number)
      if (difficulty !== undefined) {
        datas.push({
          type: 'Difficulty',
          blockNumber: difficulty.block_number,
          difficulty: difficulty.difficulty,
        })
        datas.push({
          type: 'EpochNumber',
          blockNumber: difficulty.block_number,
          epochNumber: difficulty.epoch_number,
        })
      }
    })
  } else if (difficulties && difficulties.length > 0) {
    difficulties.forEach(difficulty => {
      datas.push({
        type: 'Difficulty',
        blockNumber: difficulty.block_number,
        difficulty: difficulty.difficulty,
      })
      datas.push({
        type: 'EpochNumber',
        blockNumber: difficulty.block_number,
        epochNumber: difficulty.epoch_number,
      })
    })
  }

  return datas
}

export const getStatisticsChart = (dispatch: AppDispatch) => {
  const cachedStatisticsChartDatas = fetchCachedData<StatisticsData>(CachedKeys.StatisticsChart)
  if (cachedStatisticsChartDatas) {
    dispatch({
      type: PageActions.UpdateStatisticsChartData,
      payload: {
        statisticsChartDatas: cachedStatisticsChartDatas,
      },
    })
  }
  fetchStatisticsChart().then((wrapper: Response.Wrapper<State.StatisticsChart>) => {
    if (wrapper) {
      const statisticsChartDatas = handleStatistics(wrapper)
      if (statisticsChartDatas && statisticsChartDatas.length > 0) {
        storeCachedData(CachedKeys.StatisticsChart, statisticsChartDatas)
        dispatch({
          type: PageActions.UpdateStatisticsChartData,
          payload: {
            statisticsChartDatas,
          },
        })
      }
    }
  })
}
