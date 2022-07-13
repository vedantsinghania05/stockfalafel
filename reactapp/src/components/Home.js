import React, { Component } from 'react';
import { Container, Card, CardBody, Spinner, Toast, ToastHeader, Table, Row, Col, Button, Form, Input } from 'reactstrap'
import { connect } from 'react-redux';
import Plot from 'react-plotly.js';
import { getTechInds, getStoredStockData, webScrape, getUser } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import errorAlert from './errorAlert.png'

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: false, result: '', showGraph: false, selectedTicker: '', stockChartXValues: [],
      stockChartYClose: [], stockChartYOpen: [], stockChartYHigh: [], stockChartYLow: [], percentChange: [], numericChange: [],
      recentMovingAvgs: [], olderMovingAvgs: [], stockAvgXValues: [], volume: [], toggleGraph: false, showDataTable: false, comparisonCompany: '',
      comparisonXVals: [], comparisonYVals: [], comparisonLabel: '', highLow: '', volumeInd: [], gainHigh: [], loseLow: []
    }
  }

  componentDidMount = () => {
    this.getTechnicalIndicators()
    this.scrapeTheWeb()
  }

  scrapeTheWeb = () => {
    webScrape(getUserToken(),
      response => {
        console.log('response: ', response.data);
      },
      error => {
        console.log('error: ', error.message);
      }
    )
  }

  formatTechInds = (dataType, list, type) => {
    for (let i of dataType) {
      list.push(i)
      i.type = type
    }
  }

  getTechnicalIndicators = () => {
    let { gainHigh, loseLow, volumeInd } = this.state
    getTechInds(getUserToken(),
      response => {
        console.log(response.data)
        this.formatTechInds(response.data.gainers, gainHigh, 'Top Gainer')
        this.formatTechInds(response.data.highs, gainHigh, 'New High')
        this.formatTechInds(response.data.losers, loseLow, 'Top Loser')
        this.formatTechInds(response.data.lows, loseLow, 'New Low')
        this.formatTechInds(response.data.unusual, volumeInd, 'Unusual Volume')
        this.formatTechInds(response.data.active, volumeInd, 'Most Active')
        this.formatTechInds(response.data.volatile, volumeInd, 'Most Volatile')
        this.setState({ gainHigh: gainHigh, loseLow: loseLow, volumeInd: volumeInd })
      },
      error => {
        this.setState({ result: error.message })
      }
    )

  }

  removeResult = () => this.setState({ result: '' })

  sendtoGraph = (company) => {
    this.setState({ loading: true })

    getStoredStockData(getUserToken(), company,
      response => {
        this.setState({ showGraph: true, selectedTicker: company })
        this.fn(response.data)
        this.setState({ loading: false })
      },
      error => this.setState({ result: error.message, loading: false })
    )
  }

  fn = (stockData) => {
    let { stockAvgXValues, stockChartXValues, stockChartYClose, stockChartYHigh, stockChartYOpen, stockChartYLow, volume, numericChange, percentChange } = this.state
    let tempRecentMovingAvgs = []
    let tempOlderMovingAvgs = []
    let tempPrices = []
    let sortedStockData = [...stockData]
    sortedStockData.sort((b, a) => new Date(b.date) - new Date(a.date))

    for (let i = 0; i <= 253; i++) tempPrices.push(stockData[i].close)
    this.setState({ highLow: Math.max(...tempPrices) + "/" + Math.min(...tempPrices) })

    for (let i = 0; i < sortedStockData.length - 1; i++) {
      // Calculate 50 day moving average
      let lastFiftyAdded = 0
      let lastFiftyAvg = -1
      let addedNoCount50 = 0

      for (let i2 = 0; i2 <= 50; i2++) {
        if (sortedStockData[i - 50 + i2] && sortedStockData[i - 50 + i2].close) {
          lastFiftyAdded = lastFiftyAdded + sortedStockData[i - 50 + i2].close
          addedNoCount50++
        }
      }

      lastFiftyAvg = lastFiftyAdded / addedNoCount50
      tempRecentMovingAvgs.push(lastFiftyAvg.toFixed(2))

      // Calculate 200 day moving average
      let last200Added = 0
      let last200Avg = -1
      let addedNoCount200 = 0

      for (let i2 = 0; i2 <= 200; i2++) {
        if (sortedStockData[i - 200 + i2] && sortedStockData[i - 200 + i2].close) {
          last200Added = last200Added + sortedStockData[i - 200 + i2].close
          addedNoCount200++
        }
      }

      last200Avg = last200Added / addedNoCount200
      tempOlderMovingAvgs.push(last200Avg.toFixed(2))

      // Stock Data
      let b = +i + 1
      stockAvgXValues.push(sortedStockData[i].date)
      stockChartXValues.push(stockData[i].date)
      stockChartYClose.push(stockData[i].close.toFixed(2))
      stockChartYOpen.push(stockData[i].open.toFixed(2))
      stockChartYHigh.push(stockData[i].high.toFixed(2))
      stockChartYLow.push(stockData[i].low.toFixed(2))
      volume.push(stockData[i].volume)
      if (stockData[i].close > stockData[b].close) {
        numericChange.push((stockData[i].close - stockData[b].close).toFixed(2))
        percentChange.push((((stockData[i].close - stockData[b].close) / stockData[i].close) * 100).toFixed(3) + '%')
      }
      else {
        numericChange.push((stockData[i].close - stockData[b].close).toFixed(2))
        percentChange.push((((stockData[i].close - stockData[b].close) / stockData[i].close) * 100).toFixed(3) + '%')
      }

    }
    this.setState({ recentMovingAvgs: tempRecentMovingAvgs, olderMovingAvgs: tempOlderMovingAvgs })
  }

  chooseComparison = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    let { comparisonCompany } = this.state;

    getStoredStockData(getUserToken(), comparisonCompany,
      response => {
        this.setState({ comparisonXVals: [], comparisonYVals: [] })
        for (let i in response.data) {
          this.state.comparisonXVals.push(response.data[i].date)
          this.state.comparisonYVals.push(response.data[i].close)
        }
        this.setState({ comparisonLabel: comparisonCompany, comparisonCompany: '', loading: false })
      },
      error => {
        this.setState({ result: error.message })
      }
    )
  }

  back = () => {
    this.setState({
      showGraph: false, stockChartXValues: [], stockChartYValues: [], loading: false, showDataTable: false, toggleGraph: false,
      stockAvgXValues: [], volume: [], percentChange: [], numericChange: [], stockChartYClose: [], stockChartYOpen: [], stockChartYHigh: [], stockChartYLow: []
    })
  }

  onChangeComparison = (e) => this.setState({ comparisonCompany: e.target.value.toUpperCase() })

  graphToggle = () => this.setState({ toggleGraph: !this.state.toggleGraph })

  tableToggle = () => this.setState({ showDataTable: !this.state.showDataTable })


  render() {
    let { loading, result, gainHigh, showGraph, loseLow, recentMovingAvgs, olderMovingAvgs, selectedTicker, stockAvgXValues, stockChartXValues,
      stockChartYClose, stockChartYHigh, stockChartYOpen, stockChartYLow, volume, numericChange, percentChange,
      toggleGraph, showDataTable, comparisonXVals, comparisonYVals, comparisonLabel, comparisonCompany, highLow, volumeInd } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Home</h5>
            </div>
            {result && <Toast>
              <ToastHeader icon={<img src={errorAlert} alt='error' style={{ height: 20, width: 20 }} />} toggle={this.removeResult}>{result}</ToastHeader>
            </Toast>}
            {loading && <Spinner size='sm' color='primary'></Spinner>}

            {!showGraph && <div>
              <Row>
                <Col xs={5}>
                  {gainHigh && <Table style={{ fontSize: 13 }} hover borderless size='sm'>
                    <thead>
                      <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>Change %</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gainHigh.map((u, i) => <tr onClick={() => this.sendtoGraph(u.ticker)} key={i}>
                        <td>{u.ticker}</td>
                        <td>{'$' + u.price}</td>
                        <td>{u.percentChange + '%'}</td>
                        <td>{u.type}</td>
                      </tr>)}
                    </tbody>
                  </Table>}
                </Col>
                <Col xs={5}>
                  {loseLow && <Table style={{ fontSize: 13 }} hover borderless size='sm'>
                    <thead>
                      <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>Change %</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loseLow.map((u, i) => <tr onClick={() => this.sendtoGraph(u.ticker)} key={i}>
                        <td>{u.ticker}</td>
                        <td>{'$' + u.price}</td>
                        <td>{u.percentChange + '%'}</td>
                        <td>{u.type}</td>
                      </tr>)}
                    </tbody>
                  </Table>}
                </Col>
              </Row>
              {volumeInd && <Table style={{ fontSize: 13 }} hover borderless size='sm'>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Price</th>
                    <th>Change %</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {volumeInd.map((u, i) => <tr onClick={() => this.sendtoGraph(u.ticker)} key={i}>
                    <td>{u.ticker}</td>
                    <td>{'$' + u.price}</td>
                    <td>{u.percentChange + '%'}</td>
                    <td>{u.type}</td>
                  </tr>)}
                </tbody>
              </Table>}

            </div>}

            {showGraph && <div>
              <Button size='sm' color='primary' onClick={this.back}>{"<-"}</Button>
              <Button size='sm' color='primary' onClick={this.graphToggle}>{toggleGraph ? 'Show Data' : 'Compare Companies'}</Button>

              {!toggleGraph && <Plot
                data={[
                  { name: 'OHLC', x: stockChartXValues, type: 'ohlc', close: stockChartYClose, open: stockChartYOpen, high: stockChartYHigh, low: stockChartYLow, marker: { size: 4 }, mode: 'lines+markers', yaxis: 'y2' },
                  { x: stockAvgXValues, y: recentMovingAvgs, name: '50 Day MA', type: 'scatter', yaxis: 'y2', marker: { color: 'orange' } },
                  { x: stockAvgXValues, y: olderMovingAvgs, name: '200 Day MA', type: 'scatter', yaxis: 'y2', marker: { color: 'blue' } },
                  { x: stockChartXValues, y: volume, name: 'Volume', type: 'bar', marker: { color: 'purple' }, yaxis: 'y1' }
                ]}
                layout={{
                  yaxis: { domain: [0, 0.3] },
                  yaxis2: { domain: [0.25, 1] },
                  title: selectedTicker,
                  height: 650,
                  xaxis: {
                    rangeselector: { buttons: [{ count: 1, label: '1d', step: 'day' }, { count: 7, label: '1w', step: 'day' }, { count: 1, label: '1m', step: 'month' }, { count: 6, label: '6m', step: 'month' }, { count: 1, label: '1y', step: 'year' }, { count: 5, label: '5y', step: 'year' }, { step: 'all' }] },
                    range: [stockChartXValues[99], stockChartXValues[0]],
                    rangeslider: true
                  }
                }}
                useResizeHandler
                style={{ width: '90%' }}
              />}

              {toggleGraph && <div>
                <Form onSubmit={this.chooseComparison}>
                  <Input bsSize='sm' name='comparisonCompany' placeholder='Enter Company to Compare Here' value={comparisonCompany} onChange={this.onChangeComparison} />
                </Form>

                <Plot
                  data={[
                    { x: stockChartXValues, y: stockChartYClose, name: selectedTicker, type: 'scatter', marker: { color: 'red' }, mode: 'lines+markers' },
                    { x: comparisonXVals, y: comparisonYVals, name: comparisonLabel, type: 'scatter', marker: { color: 'blue' }, mode: 'lines+markers' }
                  ]}
                  layout={{ title: 'Company Comparison', height: 500 }}
                  useResizeHandler
                  style={{ width: '90%' }}
                  config={{ scrollZoom: true }}
                />
              </div>}

              {!toggleGraph && <Row>
                <Button size='sm' color='primary' onClick={this.tableToggle}>{showDataTable ? 'Hide Table' : 'Show Table'}</Button>
                <p>52 Week High/Low: {highLow}</p>
              </Row>}

              {showDataTable && <Table style={{ fontSize: 14 }} borderless hover size='sm'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Change(%)</th>
                    <th>Change($)</th>
                    <th>Price($)</th>
                  </tr>
                </thead>
                <tbody>
                  {stockChartXValues.map((u, i) => <tr key={i}>
                    <td>{u.split('T')[0]}</td>
                    <td>{percentChange[i]}</td>
                    <td>{numericChange[i]}</td>
                    <td>{stockChartYClose[i]}</td>
                  </tr>)}
                </tbody>
              </Table>}
            </div>}
          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);