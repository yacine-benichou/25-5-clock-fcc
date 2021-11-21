import React from 'react';
import './App.css';



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionLabel: 25,
      breakLabel: 5,
      timer: 25 * 60,
      timerLabel: 'Session',
      isSession: true,
      isTimerRunning: 0,
    }

    this.decrementLength = this.decrementLength.bind(this);
    this.incrementLength = this.incrementLength.bind(this);
    this.reset = this.reset.bind(this);
    this.playTimer = this.playTimer.bind(this);
    this.audio = React.createRef(); // create ref to use .play method on this.audio
  }

  // handle the decrementation of both Break and Session length


  decrementLength(event) {
    if (event.currentTarget.id === 'session-decrement' && this.state.sessionLabel > 1) {
      this.setState(prevState => {
        return {
          sessionLabel: prevState.sessionLabel - 1,
          timer: prevState.timer - 60,
        }
      });
    } else if (event.currentTarget.id === 'break-decrement' && this.state.breakLabel > 1) {
      this.setState(prevState => {
        return {
          breakLabel: prevState.breakLabel - 1,
        }
      });
    }
  }

  // handle the incrementation of both Break and Session length
  incrementLength(event) {
    if (event.currentTarget.id === 'session-increment' && this.state.sessionLabel < 60) {
      this.setState(prevState => {
        return {
          sessionLabel: prevState.sessionLabel + 1,
          timer: prevState.timer + 60,
        }
      });
    } else if (event.currentTarget.id === 'break-increment' && this.state.breakLabel < 60) {
      this.setState(prevState => {
        return {
          breakLabel: prevState.breakLabel + 1,
        }
      });
    }
  }


  reset() {
    clearInterval(this.state.isTimerRunning);
    this.setState({
      sessionLabel: 25,
      breakLabel: 5,
      timer: 25 * 60,
      timerLabel: 'Session',
      isSession: true,
      isTimerRunning: 0,
    });
    this.audio.current.pause();
    this.audio.current.currentTime = 0;
  }

  // plays the Session Timer with audio at the end


  playSession() {
    if (this.state.timer === 0) {
      this.setState({
        timer: this.state.breakLabel * 60,
        timerLabel: 'Break',
        isSession: false
      });
      this.audio.current.play();
    }
    else {
      this.setState(prevState => {
        return {
          timer: prevState.timer - 1
        }
      })
    }
  }

  // plays the Break Timer with audio at the end

  playBreak() {
    if (this.state.timer === 0) {
      this.setState({
        timer: this.state.sessionLabel * 60,
        timerLabel: 'Session',
        isSession: true
      });
      this.audio.current.play();
    }
    else {
      this.setState(prevState => {
        return {
          timer: prevState.timer - 1
        }
      })
    }
  }

  // handle the timer and the switch of Session and Break timer

  playTimer() {
    if (this.state.isTimerRunning) {
      clearInterval(this.state.isTimerRunning);
      this.setState(previousState => {
        return {
          previousState,
          isTimerRunning: 0,
        }
      });
      return;
    } 
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.isTimerRunning = setInterval(() => {
      if (this.state.isSession) {
        this.playSession();
      }
      else {
        this.playBreak();
      }
    }, 1000);
  }

  render() {
    const convertTimerToMinFormat = (timerInSec) => {
      let minutes = Math.floor(timerInSec / 60) < 10 ? '0' + Math.floor(timerInSec / 60) : Math.floor(timerInSec / 60);
      let seconds = Math.floor(timerInSec % 60) < 10 ? '0' + Math.floor(timerInSec % 60) : Math.floor(timerInSec % 60);

      return `${minutes}:${seconds}`;
    }
    return(
      <div className="container d-flex flex-column">
        <div className="row text-center">
          <div className="display-2 col" id="main-title">
          25 + 5 block
          </div>
        </div>
        <div className="container d-flex flex-column" id="clock-wrapper">
          <div className="row text-center">
            <div className="col" id="break-label">
              <h2>Break Length</h2>
            </div>
            <div className="col" id="session-label">
              <h2>Session Length</h2>
            </div>
          </div>
          <div className="row text-center">
            <div className="col d-flex flex-row justify-content-center" id="break-label">
              <button id="break-decrement" type="button" className="btn btn-outline-danger" onClick= {this.decrementLength} value="-"><i className="fa fa-minus"></i></button>
              <h2 className="w-25" id="break-length">{this.state.breakLabel}</h2>
              <button id="break-increment" type="button" className="btn btn-outline-success" onClick= {this.incrementLength} value="+"><i className="fa fa-plus"></i></button>
            </div>
            <div className="col d-flex flex-row justify-content-center" id="session-label">
              <button id="session-decrement" type="button" className="btn btn-outline-danger" onClick= {this.decrementLength} value="-"><i className="fa fa-minus"></i></button>
              <h2 className="w-25" id="session-length">{this.state.sessionLabel}</h2>
              <button id="session-increment" type="button" className="btn btn-outline-success" onClick= {this.incrementLength} value="+"><i className="fa fa-plus"></i></button>
            </div>
          </div>
          <div className="row text-center">
            <div className="col" id="timer-wrapper">
              <h1 id="timer-label">{this.state.timerLabel}</h1>
              <h2 id="time-left">{convertTimerToMinFormat(this.state.timer)}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center">
              <button id="start_stop" type="button" className="btn btn-success" onClick={this.playTimer} style={{backgroundColor: 'white', color: 'black', border: 'none'}}>
                <i className={this.state.isTimerRunning ? "fa fa-pause" : "fa fa-play"} style={this.state.isTimerRunning ? {color: 'red'} : {color: 'green'}}></i>
                <audio id="beep" ref={this.audio} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
              </button>
              <button id="reset" type="button" className="btn bt-primary" onClick={this.reset}><i className="fa fa-refresh"></i></button>
            </div>
          </div> 
        </div>
      </div>
    )
  }
  
}

export default App;
