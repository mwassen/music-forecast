import React from "react";
import Modal from "react-modal";
// import exit from "./exit.svg";
// import * as d3 from "d3";

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
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <div className="genre-name">{this.props.selectedData.name}</div>
            <div className="city-name">
              {" "}
              in {this.props.selectedData.location}
            </div>
          </div>
          <div className="date-range">
            {this.props.selectedData.range.join(" to ")}
          </div>
        </div>
        <div className="event-cont">
          {this.props.selectedData.events.map(event => {
            const eventGenres = event.artists
              .filter(artist => artist.topGenres)
              .map(artist => artist.topGenres.slice(0, 5))
              .flat()
              .filter(genre => genre.name !== "seen live")
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map(genre => genre.name);
            // .reduce((acc, cur) => {});

            return (
              <a
                href={event.link}
                key={event.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="event-box">
                  <div className="event-header">
                    <div className="event-date">{event.date}</div>
                    <div className="event-genres">{eventGenres.join(", ")}</div>
                  </div>
                  <div className="event-name">
                    {event.name.replace(/\(\w+ \d+, \d+\)/g, "")}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        {/* <button onClick={this.exitModal}>close</button> */}
      </div>
    ) : null;

    return (
      <Modal
        className="modal-content"
        overlayClassName="modal-overlay"
        isOpen={active}
        onRequestClose={this.exitModal}
        closeTimeoutMS={300}
        disableAutoFocus={true}
        appElement={document.getElementById("root")}
        shouldCloseOnOverlayClick={true}
      >
        {content}
      </Modal>
    );
  }
}

export default DetailsModal;
