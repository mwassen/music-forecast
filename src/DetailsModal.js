import React from "react";
import Modal from "react-modal";

class DetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.exitModal = this.exitModal.bind(this);
  }

  exitModal() {
    this.props.exitFunc();
  }

  render() {
    const active = this.props.selectedData !== null ? true : false;

    const content = active ? (
      <div>
        <h1>
          {this.props.selectedData.name} in {this.props.selectedData.location}
        </h1>
        <h2>{this.props.selectedData.range.join(" to ")}</h2>
        {this.props.selectedData.events.map(event => {
          return (
            <div className="concertDetails" key={event.link}>
              <h4>{event.date}</h4>
              <a href={event.link} rel="noopener noreferrer" target="_blank">
                <h3>{event.name.replace(/\(\w+ \d+, \d+\)/g, "")}</h3>
              </a>
            </div>
          );
        })}
        <button onClick={this.exitModal}>close</button>
      </div>
    ) : null;

    return (
      <Modal
        className="details-modal"
        isOpen={active}
        onRequestClose={this.exitModal}
        closeTimeoutMS={300}
        appElement={document.getElementById("root")}
        shouldCloseOnOverlayClick={true}
      >
        {content}
      </Modal>
    );
  }
}

export default DetailsModal;
