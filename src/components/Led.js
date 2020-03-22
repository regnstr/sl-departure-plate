import React, { useState } from 'react';

let classNames = require('classnames');

/*
function Led(props) {

  const [powered, setPowered] = useState(props.powered);

  return (
    <Circle
      x={100}
      y={100}
      draggable
      radius={50}
      fill={(powered ? 'red' : 'maroon')}
      onClick={() => setPowered(!powered)}
    />
  );
}*/


function Led(props) {

  //const [powered, setPowered] = useState(props.powered);

  let ledClass = classNames(['circle', (props.powered ? 'active' : 'inactive')]);

  return (
    <div
      className={ledClass}
      onClick={props.onClick}
    />
  );
}

export default Led;