import React, { useEffect, useReducer } from 'react';

import Led from './Led';

function toggleLed(array, i) {
  let newPower = Array.from(array);
  newPower[i] = !newPower[i];
  return newPower;
}

function setPowered(array, i) {
  let newPower = Array.from(array);
  newPower[i] = true;
  return newPower;
}


function reducer(state, action) {
  switch (action.type){
    case 'toggle':
      return { ...state, power: toggleLed(state.power, action.payload)}
    case 'tick':
      return { ...state, power: toggleLed(state.power, state.lit)}
    case 'increment':
      let newLit = state.lit +1;
      return { ...state, lit: newLit}
    }
  }

function init(numberOfLeds) {
  let powerArray = Array(numberOfLeds).fill(false);
  return {
    lit: 0,
    power: powerArray
  };
}

function LedBoard(props) {

  // Initialize state and dispatch with initial state and a reducer
  const [state, dispatch] = useReducer(reducer, props.count, init);

  // Start the timer
  useEffect(() => {

    const timer = setInterval(() => {
      dispatch({type: 'tick'});
      dispatch({type: 'increment'});
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {
        state.power.map((powered, index) =>
            <Led powered={powered} key={index} onClick={() => dispatch({type: 'toggle', payload: index})} />
          )
      }
    </>
  );
}

export default LedBoard;