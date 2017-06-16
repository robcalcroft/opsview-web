import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { requestOpsview } from '../../constants/utilities';
import Pill from '../Pill';
import styles from './HostGroups.scss';

class HostGroups extends Component {
  constructor(props) {
    super(props);

    this.getHostGroups = this.getHostGroups.bind(this);
    this.startClearOldRequestsInterval = this.startClearOldRequestsInterval.bind(this);
    this.renderHostGroup = this.renderHostGroup.bind(this);

    this.requests = [];

    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getHostGroups(this.getParentId());
    this.startClearOldRequestsInterval();
  }

  componentWillUnmount() {
    // Ensure we cancel any pending requests when we unmount
    this.requests.forEach(request => request.abort && request.abort());
  }

  getParentId() {
    return {
      parentid: this.props.match.params.parentId || 1,
    };
  }

  getHostGroups(overrideQuery = {}) {
    const { loading: isCurrentlyLoading } = this.state;

    if (!isCurrentlyLoading) {
      this.setState({
        loading: true,
      });
    }

    const request = requestOpsview({
      route: '/rest/status/hostgroup',
      query: {
        order: 'dependency',
        ...overrideQuery,
      },
      done: ({ list }) => this.setState({
        data: list,
        loading: false,
      }),
      fail: response => console.log(response),
    });

    this.requests.push(request);
  }

  startClearOldRequestsInterval() {
    this.clearOldRequestsInterval = setInterval(() => {
      this.requests = [];
    }, 20000);
  }

  isUnhandledHostGroup(hosts, services) { // eslint-disable-line class-methods-use-this
    const hostsUnhandled = Number(hosts.unhandled || 0);
    const servicesUnhandled = Number(services.unhandled || 0);

    return hostsUnhandled !== 0 || servicesUnhandled !== 0;
  }

  renderHostGroup({ // eslint-disable-line class-methods-use-this
    leaf,
    name,
    hostgroupid: hostGroupId,
    computed_state: state,
    hosts,
    services,
  }) {
    const isLeaf = (event) => {
      if (leaf === '1') {
        event.preventDefault();
        alert('This is a leaf');
      }
      return true;
    };

    return (
      <Link
        className={styles.hostgroup}
        onClick={isLeaf}
        to={`/hostgroup/${hostGroupId}`}
        key={hostGroupId}
      >
        <div className={styles.hostgroup__title}>
          <div>Name</div>
          <b>{name}</b>
        </div>
        <div style={{ display: 'flex', columnDirection: 'row' }}>
          <Pill state={state} />
          {this.isUnhandledHostGroup(hosts, services) ? (
            <Pill state="unhandled" />
          ) : (
            <Pill state="handled" />
          )}
        </div>
      </Link>
    );
  }

  render() {
    const { data, loading } = this.state;

    return (
      <div data-component-name="HostGroups">
        {loading ? <div>Loading</div> : data.map(this.renderHostGroup)}
      </div>
    );
  }
}

HostGroups.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      parentId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // location: PropTypes.shape({
  //   search: PropTypes.string,
  // }).isRequired,
};

export default HostGroups;
