import React from 'react';
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Collapsible extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          open: false
      }
      this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel(e){
      this.setState({open: !this.state.open})
  }

  render() {
    return (
      <div className="generalCollapsible">
        <div onClick={(e)=>this.togglePanel(e)} className="generalCollapsibleTitle">
            <h3>
              {this.props.title} 
              <FontAwesomeIcon 
                icon={faSortDown} 
              />
            </h3> 
        </div>
        {this.state.open ? (
          <div className="generalCollapsibleContent">
              {this.props.children}
          </div>
          ) : null
        }
      </div>
    );
  }
}