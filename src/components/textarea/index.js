import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class TextArea extends Component {

  render() {
    const {placeholder, full, ...props} = this.props;

    return (
      <textarea
        placeholder={placeholder}
        className={['composer', full ? 'full' : ''].join(' ')}
        {...props}
      />
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  full: PropTypes.bool
}

TextArea.defaultProps = {
  value: '',
  placeholder: '',
  full: false
}

export default TextArea;