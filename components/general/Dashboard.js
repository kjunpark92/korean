import React from "react";
import Modal from './Modal';
import PropTypes from 'prop-types';

export default class Dashboard extends React.Component {
 
  state = { 
      show: false,
  }

  showModal = () => {
    this.setState({ show: true });
  }
  
  hideModal = () => {
    this.setState({ show: false });
  }
    
  render() {
    return (
      <div className="mainModal">
          <Modal 
              show={this.state.show} 
              handleClose={this.hideModal} 
          >
            {this.props.children}
          </Modal>
        <button type='button' className="modalButton" onClick={this.showModal}>
            <h3>{this.props.buttonTitle}</h3>
          </button>
      </div>
    )
  }
}

Dashboard.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
} 


