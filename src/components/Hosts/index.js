import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import Row from '../Row';
import ListHeader from '../ListHeader';
import styles from './Hosts.scss';
import global from '../../styles/global.scss';
import { requestOpsview } from '../../constants/utilities';

class Hosts extends Component {
  constructor(props) {
    super(props);

    this.getHostGroupId = this.getHostGroupId.bind(this);
    this.getHosts = this.getHosts.bind(this);
    this.startClearOldRequestsInterval = this.startClearOldRequestsInterval.bind(this);
    this.refreshHosts = this.refreshHosts.bind(this);
    this.renderHost = this.renderHost.bind(this);

    this.requests = [];

    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getHosts(this.getHostGroupId());
    this.startClearOldRequestsInterval();
  }

  componentWillUnmount() {
    // Ensure we cancel any pending requests when we unmount
    this.requests.forEach(request => request.abort && request.abort());
  }

  getHostGroupId() {
    return {
      hostgroupid: this.props.match.params.hostGroupId,
    };
  }

  getHosts(query = {}) {
    const { loading: isCurrentlyLoading } = this.state;

    if (!isCurrentlyLoading) {
      this.setState({
        loading: true,
      });
    }

    const request = requestOpsview({
      route: '/rest/status/host',
      query,
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

  refreshHosts() {
    this.getHosts(this.getHostGroupId());
  }

  renderHost(row) { // eslint-disable-line class-methods-use-this
    return (
      <Link key={btoa(row.name)} to={`/service/${row.name}`} className={global.focusAndActive}>
        <Row>
          <div className={styles.host__title}>
            <div>Name</div>
            <b>{row.name}</b>
          </div>
        </Row>
      </Link>
    );
  }

  render() {
    const { data, loading } = this.state;

    return (
      <div data-component-name="Host" style={{ height: '100%' }}>
        <ListHeader
          title="Hostgroups > Hosts"
          buttons={[{
            label: 'Refresh',
            props: { onClick: this.refreshHosts },
          }]}
        />
        {loading ? <Loader /> : data.map(this.renderHost)}
      </div>
    );
  }
}

Hosts.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      hostGroupId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Hosts;
