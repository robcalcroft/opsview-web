import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import Row from '../Row';
import ListHeader from '../ListHeader';
import styles from './Services.scss';
import global from '../../styles/global.scss';
import { requestOpsview } from '../../constants/utilities';

class Services extends Component {
  constructor(props) {
    super(props);

    this.getServiceGroupId = this.getServiceGroupId.bind(this);
    this.getServices = this.getServices.bind(this);
    this.startClearOldRequestsInterval = this.startClearOldRequestsInterval.bind(this);
    this.refreshServices = this.refreshServices.bind(this);
    this.renderService = this.renderService.bind(this);

    this.requests = [];

    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getServices(this.getServiceGroupId());
    this.startClearOldRequestsInterval();
  }

  componentWillUnmount() {
    // Ensure we cancel any pending requests when we unmount
    this.requests.forEach(request => request.abort && request.abort());
  }

  getServiceGroupId() {
    return {
      hostname: this.props.match.params.hostname,
    };
  }

  getServices(query = {}) {
    const { loading: isCurrentlyLoading } = this.state;

    if (!isCurrentlyLoading) {
      this.setState({
        loading: true,
      });
    }

    const request = requestOpsview({
      route: '/rest/status/service',
      query,
      done: ({ list }) => {
        const services = [];
        for (let i = 0; i < list.length; i += 1) {
          const { services: extractedServices } = list[i];
          for (let j = 0; j < extractedServices.length; j += 1) {
            services.push(extractedServices[j]);
          }
        }
        this.setState({
          data: services,
          loading: false,
        });
      },
      fail: response => console.log(response),
    });

    this.requests.push(request);
  }

  startClearOldRequestsInterval() {
    this.clearOldRequestsInterval = setInterval(() => {
      this.requests = [];
    }, 20000);
  }

  refreshServices() {
    this.getServices(this.getServiceGroupId());
  }

  renderService(row) { // eslint-disable-line class-methods-use-this
    return (
      <Link key={btoa(row.name)} to={`/investigate/${row.name}`} className={global.focusAndActive}>
        <Row>
          <div className={styles.service__title}>
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
      <div data-component-name="Service" style={{ height: '100%' }}>
        <ListHeader
          title="Hostgroups > Hosts > Services"
          buttons={[{
            label: 'Refresh',
            props: { onClick: this.refreshServices },
          }]}
        />
        {loading ? <Loader /> : data.map(this.renderService)}
      </div>
    );
  }
}

Services.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      hostname: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Services;
