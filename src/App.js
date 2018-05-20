import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class CommandOutput extends Component {
  constructor(props) {
    super(props);

    this.state = this.convertDateForState(new Date());
  }

  convertDateForState(d) {
    if (this.props.utc) {
      return {
        m: d.getUTCMinutes(),
        h: d.getUTCHours(),
        dow: d.getUTCDay(),
      };
    }
    else {
      return {
        m: d.getMinutes(),
        h: d.getHours(),
        dow: d.getDay(),
      };
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillMount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState(
      this.convertDateForState(new Date())
    );
  }

  render() {
    return (
      <pre>
        <code>{this.state.m + 1} {this.state.h} * * {this.state.dow} {this.props.cmd}</code>
      </pre>
    );
  }
}

class CommandSelect extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const isUTC = event.target.value === "utc";
    this.props.onChange(isUTC); // From Command Component
  }

  render() {
    const d = new Date();

    // Get the timezone
    var tz = d.toTimeString();
    tz = tz.substr(tz.indexOf("(")+1, 3); // e.g. HKT

    return (
      <select onChange={this.handleChange}>
        <option value="utc">UTC</option>
        {tz !== "utc" &&
          <option value="not-utc">{tz}</option>
        }
      </select>
    );
  }
}

class Command extends Component {
  constructor(props) {
    super(props);
    this.state = {isUTC: true};
  }

  handleChange(i) {
    this.setState({
      isUTC: i,
    });
  }

  render() {
    return (
      <div>
        <p>
          Select <code>UTC</code> for AWS
        </p>
        <CommandSelect
          onChange={i => this.handleChange(i)}
        />
        <h2>Test</h2>
        <p>
          Run
        </p>
        <pre>
          <code>$ sudo crontab -e</code>
        </pre>
        <p>
          Put
        </p>
        <CommandOutput utc={this.state.isUTC} cmd={this.props.cmd} />
        <p>
          at the end, save and exit
        </p>
        <p>
          Run
        </p>
        <pre>
          <code>$ sudo cat /var/log/letsencrypt/letsencrypt.log</code>
        </pre>
        <p>
          after one minute, log changed
        </p>
        <h2>Add Job</h2>
        <p>
          Run
        </p>
        <pre>
          <code>$ sudo crontab -e</code>
        </pre>
        <p>
          Replace the last line with
        </p>
        <pre>
          <code>0 0 * * 6 certbot renew</code>
        </pre>
        <p>
          to run every saturday
        </p>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WHS React</h1>
        </header>
        <p className="App-intro">
          <h1>Setup Up Let's Encrypt Auto Renew</h1>
          <Command cmd="certbot renew --dry-run" />
        </p>
      </div>
    );
  }
}

export default App;
