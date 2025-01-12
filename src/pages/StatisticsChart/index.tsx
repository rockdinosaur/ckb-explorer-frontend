import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import Content from '../../components/Content'
import Loading from '../../assets/loading.gif'
import { isMobile } from '../../utils/screen'
import { getStatisticsChart } from '../../service/app/statisticsChart'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'

const ChartPanel = styled.div`
  margin: 0 10% 30px 10%;
  background: white;

  @media (max-width: 700px) {
    margin: 0 4% 30px 4%;
  }
`

const ChartTitle = styled.div`
  color: #66666;
  background: white;
  margin: 20px 10% 0 10%;
  padding-top: 10px;
  font-size: 24px;
  text-align: center;

  @media (max-width: 700px) {
    margin: 20px 4% 0 4%;
    font-size: 16px;
  }
`

const LoadingPanel = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
  align-items: center;
  justify-content: center;

  > img {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 700px) {
      width: 50px;
      height: 50px;
    }
  }
`

const scale = {
  difficulty: {
    min: 0,
    alias: 'Difficulty',
  },
  hashRate: {
    min: 0,
    alias: 'Hash Rate(gps)',
  },
  epochNumber: {
    min: 0,
    alias: 'Epoch Number',
  },
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch>) => {
  const { statisticsChartDatas } = useContext(AppContext)

  useEffect(() => {
    getStatisticsChart(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>Difficulty & Hash Rate</ChartTitle>
      {statisticsChartDatas.length > 1 ? (
        <ChartPanel>
          <Chart
            height={window.innerHeight * 0.7}
            scale={scale}
            forceFit
            data={statisticsChartDatas}
            padding={isMobile() ? [40, 90, 80, 90] : [80, 90, 100, 90]}
          >
            <Legend
              custom
              allowAllCanceled
              clickable={false}
              textStyle={{
                fontSize: '15',
                fontWeight: 'bold',
                fill: '#666666',
              }}
              items={[
                {
                  value: 'Difficulty',
                  fill: '#3182bd',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#3182bd',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
                {
                  value: 'Hash Rate(gps)',
                  fill: '#66CC99',
                  marker: {
                    symbol: 'hyphen',
                    stroke: '#66CC99',
                    radius: 5,
                    lineWidth: 3,
                  },
                },
              ]}
            />
            <Axis
              name="difficulty"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#3182bd',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis
              name="hashRate"
              title={!isMobile()}
              label={{
                textStyle: {
                  fill: '#66CC99',
                  fontWeight: 'bold',
                },
              }}
            />
            <Axis name="epochNumber" visible={false} />
            <Tooltip />
            <Geom type="line" position="blockNumber*difficulty" color={['type', ['#3182bd']]} size={1} shape="hv" />
            <Geom type="line" position="blockNumber*hashRate" color={['type', ['#66CC99']]} size={1} shape="line" />
            <Geom position="blockNumber*epochNumber" color={['type', ['#3182bd']]} size={0} />
          </Chart>
        </ChartPanel>
      ) : (
        <LoadingPanel>
          <img src={Loading} alt="loading" />
        </LoadingPanel>
      )}
    </Content>
  )
}
