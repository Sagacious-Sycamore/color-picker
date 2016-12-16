import React from 'react';
import {Col} from 'react-bootstrap';

class SingleBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
    this.toggleHover = this.toggleHover.bind(this);
    // this.onClickHandler = this.onClickHandler.bind(this);
  }

  toggleHover() {
    this.setState({hover: !this.state.hover})
  }

  onClickHandler() {
    // this.props.setCurrentFamily(this.props.colorFamily);
    // this.props.toggleSidebarOn();
  }

  render() {
    var styles = {
      background: {
        backgroundColor: this.props.color,
        height: "100px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease-in-out',
      }
    };
    if (this.state.hover) {
      styles.background.boxShadow = '-3px 0 10px'
    }
    return (
      <div onClick={this.props.click} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
      {this.props.index === 0 ? (
        <Col className="color-single" style={styles.background} xs={2} xsOffset={1}>
          <h4 style={styles.text}>{this.props.color}</h4>
        </Col>
      ) : (
        <Col className="color-single" style={styles.background} xs={2}>
          <h4 style={styles.text}>{this.props.color}</h4>
        </Col>
      )}
      </div>
    )
  }
}

module.exports = SingleBlock;