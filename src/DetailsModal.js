import React from "react";
import Modal from "react-modal";
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
        <svg
          className="close-btn"
          alt="close"
          onClick={this.exitModal}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 802.5 802.5"
        >
          <g>
            <path d="M401.25,246.25l235-235c15-15,39-15,55,0l100,101a39.24,39.24,0,0,1,0,55l-234,234,234,235c15,15,15,39,0,55l-100,100c-16,15-40,15-55,0l-235-234-234,234a39.24,39.24,0,0,1-55,0l-101-100c-15-16-15-40,0-55l235-235-235-234a39.24,39.24,0,0,1,0-55l101-101a39.24,39.24,0,0,1,55,0Z" />
          </g>
        </svg>
        <div className="modal-header">
          <div>
            <div className="genre-name">
              {this.props.selectedData.name.toLowerCase()}
            </div>
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
              .map(genre => genre.name.toLowerCase());
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
        isOpen={this.props.active}
        closeTimeoutMS={300}
        onRequestClose={this.exitModal}
        disableAutoFocus={true}
        appElement={document.getElementById("root")}
      >
        {content}
      </Modal>
    );
  }
}

export default DetailsModal;
