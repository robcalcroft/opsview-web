import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { requestOpsview, getStateColour } from '../../constants/utilities';

class Hosts extends Component {
  constructor(props) {
    super(props);

    this.getHosts = this.getHosts.bind(this);

    this.state = {
      hosts: {
        data: [],
        loading: false,
        pages: -1,
      },
    };
  }

  getHostColumns() { // eslint-disable-line class-methods-use-this
    return [{
      Header: 'Name',
      accessor: 'name',
    }, {
      Header: 'State',
      Cell: ({ original: { state } }) => (
        <div style={{ backgroundColor: getStateColour(state) }}>{state.toUpperCase()}</div>
      ),
      accessor: 'state',
    }];
  }

  getHosts(state, instance, customQuery = {}) {
    this.setState({
      hosts: {
        ...this.state.hosts,
        loading: true,
      },
    });

    requestOpsview({
      route: '/rest/status/host',
      query: {
        order: 'dependency',
        page: state.page,
        rows: state.pageSize,
        ...customQuery,
      },
      done: ({ summary, list }) => this.setState({
        hosts: {
          data: list,
          pages: Math.ceil(Number(summary.total) / state.pageSize),
          loading: false,
        },
      }),
      fail: response => console.log(response),
    });
  }

  render() {
    const { data, pages, loading } = this.state.hosts;

    return (
      <div>
        <ReactTable
          data={data}
          pages={pages}
          loading={loading}
          columns={this.getHostColumns()}
          minRows={1}
          showPageJump={false}
          onFetchData={this.getHosts}
          manual
        />
      </div>
    );
  }
}

export default Hosts;
