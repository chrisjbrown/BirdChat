import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reveal from 'react-reveal';

import 'animate.css/animate.css';
import './index.css';

class Message extends Component {

  render() {
    const {message, originatorIsYou, date} = this.props;

    return (
      <Reveal effect={`animated ${originatorIsYou ? 'fadeInRight' : 'fadeInLeft'}`}>
        <li className={`message ${originatorIsYou ? 'outgoing' : 'incoming'}`}>
          <div className="content">
            <div className="date-time">
              {date}
            </div>
            <p>{message}</p>
          </div>
        </li>
      </Reveal>
    );
  }
}

Message.propTypes = {
  originatorIsYou: PropTypes.bool.isRequired,
  message: PropTypes.string,
  date: PropTypes.string
}

Message.defaultProps = {
  originatorIsYou: false,
  message: '',
  date: ''
}

export default Message;