import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { requestOpsview } from '../../constants/utilities';
import Pill from '../Pill';
import Loader from '../Loader';
import ListHeader from '../ListHeader';
import Dial from '../Dial';
import Row from '../Row';
import styles from './HostGroups.scss';
import colours from '../../styles/colours.scss';
import global from '../../styles/global.scss';

class HostGroups extends Component {
  constructor(props) {
    super(props);

    this.getHostGroups = this.getHostGroups.bind(this);
    this.toggleAutoRefresh = this.toggleAutoRefresh.bind(this);
    this.startClearOldRequestsInterval = this.startClearOldRequestsInterval.bind(this);
    this.refreshHostGroups = this.refreshHostGroups.bind(this);
    this.renderHostGroup = this.renderHostGroup.bind(this);

    this.requests = [];

    this.state = {
      data: [],
      loading: true,
      lastUpdated: false,
      autoRefresh: false,
    };
  }

  componentDidMount() {
    this.getHostGroups(this.getParentId());
    this.startClearOldRequestsInterval();
    this.toggleAutoRefresh();
  }

  // React router doesn't remount when only parameters change in the route. So we listen to when the
  // props change
  componentWillReceiveProps(nextProps) {
    // Only run when the params has changed
    const { parentId: currentParentId } = this.props.match.params;
    const { parentId: newParentId } = nextProps.match.params;

    // This simulates the component being remounted
    if (currentParentId !== newParentId) {
      this.setState({
        data: [],
        loading: true,
      }, this.componentDidMount);
    }
  }

  componentWillUnmount() {
    // Ensure we cancel any pending requests when we unmount
    clearInterval(this.clearOldRequestsInterval);
    this.requests.forEach(request => request.abort && request.abort());
  }

  getParentId() {
    return {
      parentid: this.props.match.params.parentId || 1,
    };
  }

  getHostGroups(query = {}) {
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
        ...query,
      },
      done: ({ list }) => this.setState({
        data: list,
        loading: false,
        lastUpdated: new Date(),
      }),
      fail: response => console.log(response),
    });

    this.requests.push(request);
  }

  getDialProps(counts) { // eslint-disable-line class-methods-use-this
    const { total, up, ok, down, critical, warning, unreachable, unknown } = counts;
    const props = { total };

    if (up) { props.green = Number(up.unhandled || 0) + Number(up.handled || 0); }
    if (ok) { props.green = Number(ok.unhandled || 0) + Number(ok.handled || 0); }
    if (down) { props.red = Number(down.unhandled || 0) + Number(down.handled || 0); }
    if (critical) { props.red = Number(critical.unhandled || 0) + Number(critical.handled || 0); }
    if (warning) { props.yellow = Number(warning.unhandled || 0) + Number(warning.handled || 0); }
    if (unreachable) {
      props.purple = Number(unreachable.unhandled || 0) + Number(unreachable.handled || 0);
    }
    if (unknown) { props.purple = Number(unknown.unhandled || 0) + Number(unknown.handled || 0); }

    return props;
  }

  getTagLine(counts, suffix) { // eslint-disable-line class-methods-use-this
    // The suffix should not be plural
    const states = {
      up: counts.up,
      ok: counts.ok,
      critical: counts.critical,
      down: counts.down,
      warning: counts.warning,
      unreachable: counts.unreachable,
      unknown: counts.unknown,
    };
    const itemOfInterest = Object.keys(states).reduce((previous, current) => {
      if (states[current] && states[current].unhandled) {
        const unhandledCount = Number(states[current].unhandled);
        const previousHighestUnhandledCount = previous[0];

        if (unhandledCount > previousHighestUnhandledCount) {
          return [unhandledCount, current];
        }
        return previous;
      }
      return previous;
    }, [0, '']);

    if (itemOfInterest[0] === 0 || itemOfInterest[1] === '') {
      return {
        raw: `All ${suffix}s handled`,
        jsx: `All ${suffix}s handled`,
      };
    }

    return {
      raw: `There ${itemOfInterest[0] === 1 ? 'is' : 'are'} ${itemOfInterest[0]} ${itemOfInterest[1]} ${suffix}${itemOfInterest[0] === 1 ? '' : 's'}`,
      jsx: (
        <span className={colours[`${itemOfInterest[1]}Text`]}>
          <b>There {itemOfInterest[0] === 1 ? 'is' : 'are'} {itemOfInterest[0]} {itemOfInterest[1]} {suffix}{itemOfInterest[0] === 1 ? '' : 's'}</b>
        </span>
      ),
    };
  }

  toggleAutoRefresh() {
    const { autoRefresh } = this.state;

    if (autoRefresh) {
      clearInterval(this.autoRefreshInterval);
    } else {
      this.autoRefreshInterval = setInterval(this.refreshHostGroups, 60000);
    }

    this.setState({
      autoRefresh: !autoRefresh,
    });
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

  refreshHostGroups() {
    this.getHostGroups(this.getParentId());
  }

  renderHostGroup({ // eslint-disable-line class-methods-use-this
    leaf,
    name,
    hostgroupid: hostGroupId,
    computed_state: state,
    hosts,
    services,
  }) {
    const hostsTagLine = this.getTagLine(hosts, 'host');
    const servicesTagLine = this.getTagLine(services, 'service');

    return (
      <Link
        className={global.focusAndActive}
        to={`/${leaf === '1' ? 'host' : 'hostgroup'}/${hostGroupId}`}
        key={hostGroupId}
      >
        <Row>
          <div className={styles.hostgroup__title}>
            <div>Name</div>
            <b>{name}</b>
          </div>
          <div style={{ display: 'flex' }}>
            <div className={styles.hostgroup__dialLabel}>Hosts</div>
            <Dial {...this.getDialProps(hosts)} fillColour="#e8eaed" />
            <div className={styles.hostgroup__dialLabel}>Services</div>
            <Dial {...this.getDialProps(services)} fillColour="#e8eaed" />
            <div className={styles.hostgroup__highlights}>
              <span title={hostsTagLine.raw}>{hostsTagLine.jsx}</span>
              <span title={servicesTagLine.raw}>{servicesTagLine.jsx}</span>
            </div>
            <Pill state={state} />
            {this.isUnhandledHostGroup(hosts, services) ? (
              <Pill state="unhandled" />
            ) : (
              <Pill state="handled" />
            )}
          </div>
        </Row>
      </Link>
    );
  }

  render() {
    const { data, loading, lastUpdated, autoRefresh } = this.state;

    return (
      <div data-component-name="HostGroups" style={{ height: '100%' }}>
        <ListHeader
          title="Hostgroups"
          buttons={[{
            label: 'Refresh',
            props: { onClick: this.refreshHostGroups },
            supplementaryText: `Last updated ${lastUpdated ? lastUpdated.toLocaleString() : 'never'}`,
          }, {
            label: `${autoRefresh ? 'Disable' : 'Enable'} Auto Refresh`,
            props: { onClick: this.toggleAutoRefresh },
          }]}
        />
        {loading ? <Loader /> : data.map(this.renderHostGroup)}
      </div>
    );
  }
}

// TODO: Refactor this prop logic into a `screen` component so that this component only recieves
// one `parentId` prop
HostGroups.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      parentId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default HostGroups;
