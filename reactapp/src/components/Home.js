import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Table } from 'reactstrap'
import Plot from 'react-plotly.js';

class Home extends Component {
  constructor() {
    super();
    this.state = { userCompanyList: [], showGraph: false, selectedTicker: undefined, stockChartXValues: [], stockChartYValues: [], companiesStr: '' }
  }

  onChangeCompaniesStr = (e) => {
    this.setState({ companiesStr: e.target.value.toUpperCase()})
  }

  chooseCompanies = (e) => {
    let { companiesStr, userCompanyList } = this.state
    e.preventDefault()
    for (let i of companiesStr.split(', ')) {
      userCompanyList.push(i)
      this.setState({companiesStr: ''})
    }
  }

  sendtoGraph = (companyTicker) => {
    let { stockChartXValues, stockChartYValues } = this.state
    let testData = [{date: "2020-6-15", open: 111.11}, {date: "2020-6-14", open: 50.02}]

    this.setState({ showGraph: true, selectedTicker: companyTicker })
    for (let i in testData) {
      stockChartXValues.push(testData[i].date)
      stockChartYValues.push(testData[i].open)    
    }
  }

  back = () => {
    this.setState({ showGraph: false})
  }


  render() {
    let { userCompanyList, showGraph, selectedTicker, stockChartXValues, stockChartYValues, companiesStr } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

              <div className="card__title">
                <h5 className="bold-text">{showGraph ? <Button size='sm' color='primary' onClick={this.back}>{"<-"}</Button> : "Home"}</h5>
              </div>

              {!showGraph && <div>
                <Form onSubmit={this.chooseCompanies}>
                  <Input bsSize='sm' name='companiesStr' placeholder='Enter Companies Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
                </Form>

                  <Table size='sm'>
                  <tbody>
                    {userCompanyList && userCompanyList.map((company, i) => <tr key={i}>
                      <td>{company}</td>
                      <td><Button size='sm' color='primary' onClick={() => this.sendtoGraph(company)}>{"->"}</Button></td>
                    </tr>)}
                  </tbody>
                </Table>
              </div>}

            {showGraph && <div>
              <Plot
                data={[
                  {
                    x: stockChartXValues,
                    y: stockChartYValues,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'red'},
                  }
                ]}
                layout={{width: 720, height: 440, title: selectedTicker}}
              />
            </div>}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default Home;