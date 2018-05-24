import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

//Array of initial players.
var PLAYERS = [
  {
    name: "Example Player",
    score: 18,
    id: 1,
  },
];

var nextId = 4;

var Stopwatch = createReactClass({

  getInitialState: function() {
      return {
        running: false,
        elapsedTime: 0,
        previousTime: 0,
      }
  },

  componentDidMount: function() {
    this.interval = setInterval(this.onTick, 100);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }
  },

  onStart: function() {
    this.setState({
      running: true,
      previousTime: Date.now(),
    });
  },

  onStop: function() {
    this.setState({running: false});
  },

  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },

  render : function () {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="scoreboard__stopwatch mini-6">
        <h2>Stopwatch</h2>
        <div className="scoreboard__stopwatch-time">{seconds}</div>
        {this.state.running ? <button onClick={this.onStop}>Stop</button> : <button onClick={this.onStart}>Start</button>}
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});



var AddPlayerForm = createReactClass({
  propTypes: {
    onAdd: PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      name: "",
    };
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  },

  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  render: function() {
    return (
      <div className="scoreboard__add-player">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange}/>
          <input type="submit" value="Add Player" />
        </form>
      </div>
    )
  }
});



function Stats (props) {
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player){
    return total + player.score;
  }, 0);

  return (
    <table className="scoreboard__stats mini-6">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: PropTypes.array.isRequired,
};



function Header(props) {
  return (
    <div className="scoreboard__header">
      <h1>{props.title}</h1>
      <Stats players={props.players}/>
      <Stopwatch />
    </div>
  );
}

Header.displayName = 'Header';

Header.propTypes = {
  title: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
}



function Counter (props) {
  return (
    <div className="scoreboard__counter">
      <button className="scoreboard__button scoreboard__button--decrement" onClick={function() {props.onChange(-1);}}> - </button>
      <div className="scoreboard__score">{props.score}</div>
      <button className="scoreboard__button scoreboard__button--increment" onClick={function() {props.onChange(1);}}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}




function Player(props) {
  return (
    <div className="scoreboard__player mini-12"> 

      <div className="scoreboard__player-name">{props.name}</div>
      <a className="scoreboard__player-remove" onClick={props.onRemove}>✖</a>

      <div className="scoreboard__player-score">
        <Counter score={props.score} onChange={props.onScoreChange} />
      </div>

    </div>
  );
}

Player.displayName = 'Player';

Player.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}




var Application = createReactClass ({
  propTypes: {
    title: PropTypes.string,
    initialPlayers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
    })).isRequired,
  },

  displayName: 'Application',

  getDefaultProps: function () {
    return {
      title: "Scoreboard",
    }
  },

  getInitialState: function() {
    return {
      players: this.props.initialPlayers,
    }
  },

  onScoreChange : function(index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  },

  onPlayerAdd: function(name) {
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    this.setState(this.state);
    nextId += 1;
  },

  onRemovePlayer: function(index) {
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },

  render: function() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />

        <div className="scoreboard__players">
          {this.state.players.map(function(player, index) {
            return (
              <Player 
              onScoreChange={function(delta) {this.onScoreChange(index ,delta)}.bind(this)}
              onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
              name={player.name} 
              score={player.score}
              key={player.id} />
            );
          }.bind(this))}
        </div>

        <AddPlayerForm onAdd={this.onPlayerAdd}/>
      </div>
    );
  }
});




ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('scoreboard-container'));

export default Application;
