import React from 'react';
import axios from 'axios';
import { connect } from "react-redux";

class AddToMemoryBank extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memoryText: 'Add to MemoryBank',
    }
  }

  addItem = () =>{

    if(this.props.userData.username){
      const headers = {'Content-Type': 'application/x-www-form-urlencoded'};

      const fd = new FormData();
      
      fd.append('username', this.props.userData.username);
      fd.append('actionType', 'addItem');
      fd.append('itemType', this.props.type);
      fd.append('id', this.props.items);
  
      axios.post('https://kiipgrammar.com/backend/updateMemoryBank.php', fd, headers)
      .then(res=>{
        console.log(res.data);
        this.setState({memoryText: res.data});
      })
      .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
      });

    } else {
      return alert('Please log in to use this function!')
    }


  }

  render(){
    return (
      <button 
        className={`memoryBankAddButton levelsBorderLevel${this.props.level}`}
        onClick={this.addItem}
      >
        {this.state.memoryText}
      </button>
    )
  }
}

const mapStateToProps = state => ({
  level: state.levels.level, //load the level data
  userData: state.login.userData
});

export default connect(mapStateToProps)(AddToMemoryBank);