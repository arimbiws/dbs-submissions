import React from 'react';

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      isError: false,
    };

    this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
    this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);
    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
  }

  onTitleChangeEventHandler(event) {
    const inputLength = event.target.value.length;
    if (inputLength <= 50) {
      this.setState({ title: event.target.value });
    }
  }

  onBodyChangeEventHandler(event) {
    this.setState({ body: event.target.value });
    if (event.target.value.length >= 10 && this.state.isError) {
      this.setState({ isError: false });
    }
  }

  onSubmitEventHandler(event) {
    event.preventDefault();

    if (this.state.body.length < 10) {
      this.setState({ isError: true });
      return;
    }
    this.props.addNote({ title: this.state.title, body: this.state.body });

    this.setState({ title: '', body: '', isError: false });
  }

  render() {
    const remainingChars = 50 - this.state.title.length;
    const charLimitClass = `note-input__title__char-limit ${remainingChars < 10 ? 'note-input__title__char-limit--warn' : ''}`;

    return (
      <div className="note-input" data-testid="note-input">
        <h2>Buat catatan</h2>

        {this.state.isError && <p className="note-input__feedback--error">Isi catatan minimal harus 10 karakter</p>}

        <form onSubmit={this.onSubmitEventHandler} data-testid="note-input-form">
          <p className={charLimitClass} data-testid="note-input-title-remaining">
            Sisa karakter: {remainingChars}
          </p>
          <input className="note-input__title" type="text" placeholder="Ini adalah judul ..." value={this.state.title} onChange={this.onTitleChangeEventHandler} required data-testid="note-input-title-field" />
          <textarea className="note-input__body" placeholder="Tuliskan catatanmu di sini ..." value={this.state.body} onChange={this.onBodyChangeEventHandler} required data-testid="note-input-body-field" />
          <button type="submit" data-testid="note-input-submit-button">
            Buat
          </button>
        </form>
      </div>
    );
  }
}

export default NoteInput;
