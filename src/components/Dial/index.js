import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STATE_COLOURS } from '../../constants/globals';

// This component was first used in the mobile app and was ported across to web
// it uses SVG circles overlayed to create the effect
class Dial extends Component {
  renderCircles() {
    const { red, green, yellow, purple, size } = this.props;
    const colours = {};
    const pieTotal = size * 1.26;
    const colourMap = {
      red: STATE_COLOURS.critical,
      yellow: STATE_COLOURS.warning,
      green: STATE_COLOURS.ok,
      purple: STATE_COLOURS.unknown,
    };

    colours.red = red;
    colours.green = green;
    colours.yellow = yellow;
    colours.purple = purple;

    // This sorts the colour objects into order as an array of the colours based on size
    // they are then matched with their value when the circle is rendered
    const objectCounts = (
      Object.keys(colours).sort((first, second) => colours[first] > colours[second]).reverse()
    );

    if (objectCounts === undefined || objectCounts.length === 0) {
      return null;
    }

    // This creates a cumulative colours array where each one is added to the other in order
    // to allow the pie chart to accuratly show each portion without the other sitting on top
    // as they all start from zero and are then layered in reverse order so need to be padded
    // with the result of the previous one.
    const stackedAndPercentagedColours = objectCounts.reverse().reduce(
      (carry, item, index) => {
        // Clone the array to prevent reassigning to args
        const newCarry = Object.assign({}, carry);
        newCarry[item] += (newCarry[objectCounts[index - 1]] || 0);
        return newCarry;
      }
    , colours);

    const objectTotal = (
      objectCounts.reduce((carry, item) => carry + colours[item], 0)
    );

    return objectCounts.reverse().map(item => (
      <circle
        key={item}
        origin={`${size / 2},${size / 2}`}
        cx={size / 2}
        cy={size / 2}
        r={size * 0.2}
        stroke={colours[item] === 0 ? 'transparent' : colourMap[item]}
        strokeWidth={size * 0.4}
        fill="none"
        strokeDasharray={`${(pieTotal * (stackedAndPercentagedColours[item] / objectTotal)) || 0}, ${pieTotal}`}
      />
    ));
  }

  render() {
    const { yModifier, size, fillColour, fontSize } = this.props;

    return (
      <svg height={size} width={size}>
        <circle cx={size / 2} cy={size / 2} r={size * 0.4} fill="#ddd" />
        {this.renderCircles()}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={Math.floor(size / 3.846)}
          fill={fillColour || 'white'}
        />
        <text
          x={size / 2}
          y={(size / 1.75) + yModifier}
          textAnchor="middle"
          fontSize={fontSize}
        >
          {this.props.total}
        </text>
      </svg>
    );
  }
}

Dial.propTypes = {
  red: PropTypes.number,
  yellow: PropTypes.number,
  purple: PropTypes.number,
  green: PropTypes.number,
  total: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  yModifier: PropTypes.number,
  size: PropTypes.number,
  fillColour: PropTypes.string,
  fontSize: PropTypes.string,
};

Dial.defaultProps = {
  red: 0,
  yellow: 0,
  purple: 0,
  green: 0,
  total: 0,
  yModifier: 0,
  size: 70,
  fillColour: 'white',
  fontSize: '14px',
};

export default Dial;
