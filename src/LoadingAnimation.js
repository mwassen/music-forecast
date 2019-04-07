import React, { Component } from "react";
import { ScaleLoader } from "react-spinners";

class LoadingAnimation extends Component {
  render() {
    if (!this.props.active) return null;
    return (
      <div>
        <ScaleLoader color="rgb(50, 50, 50)" />
        <p>{this.props.text}</p>
        {/* <p>( loading... this might take a while )</p> */}
      </div>
    );
  }
}

export default LoadingAnimation;
