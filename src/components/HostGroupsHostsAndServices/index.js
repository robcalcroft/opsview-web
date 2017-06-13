import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { requestCore } from '../../constants/utilities';

class HostGroupsHostsAndServices extends Component {
  constructor(props) {
    super(props);

    this.getHostGroups = this.getHostGroups.bind(this);

    this.state = {
      hostgroups: {
        data: [],
        pages: -1,
        loading: false,
      },
    };
  }

  getHostGroupColumns() { // eslint-disable-line class-methods-use-this
    return [{
      Header: 'Name',
      accessor: 'name',
    }, {
      Header: 'State',
      accessor: 'computed_state',
    }];
  }

  getHostGroups(state) {
    this.setState({
      loading: true,
    });
    console.log(state);
    requestCore({
      url: '/rest/status/hostgroup',
      query: {
        parentid: 1,
        order: 'dependency',
        page: state.page,
        rows: 'all' || state.pageSize,
      },
      headers: {
        'content-type': 'application/json',
        'x-opsview-token': localStorage.getItem('opsview_token'),
        'x-opsview-username': localStorage.getItem('opsview_username'),
      },
      done: ({ summary, list }) => this.setState({
        hostgroups: {
          data: list,
          pages: Math.ceil(summary.totalhgs / state.pageSize),
          loading: false,
        },
      }),
    });
  }

  render() {
    const { data, loading, pages } = this.state.hostgroups;

    return (
      <div>
        Hosts
        <ReactTable
          data={data}
          columns={this.getHostGroupColumns()}
          loading={loading}
          pages={pages}
          onFetchData={this.getHostGroups}
          minRows={1}
          manual
        />
      </div>
    );
  }
}

export default HostGroupsHostsAndServices;
