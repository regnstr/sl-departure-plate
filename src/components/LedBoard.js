import React, { useEffect, useReducer } from 'react';

import Led from './Led';

import _ from 'lodash';

const URL = 'http://185.242.230.19:5001';
//const URL = 'http://localhost:5001';


async function toggleRemote(url = '', index) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({index: index})
  });
  return response.json();
}




async function fetchLedState() {
  let response = await fetch(URL);
  let data = response.json();
  return data;
}






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
  let newToggled;
  let newPower;
  switch (action.type){
    
    case 'toggle':
      //return { ...state, power: toggleLed(state.power, action.payload)};
      newToggled = Array.from(state.toggled);
      newToggled[action.payload] = !state.toggled[action.payload];
      newPower = _.zipWith(newToggled, state.basePower, (a, b) => (a !== b));
      return { ...state, toggled: newToggled, power: newPower };
    case 'tick':
      return { ...state, power: toggleLed(state.power, state.lit)};
    case 'increment':
      let newLit = state.lit +1;
      return { ...state, lit: newLit};
    case 'set-data':
      newPower = _.zipWith(state.toggled, action.payload, (a, b) => (a !== b));
      return { ...state, basePower: action.payload, power: newPower };
    }
  }

function init(numberOfLeds) {
  let powerArray = Array(numberOfLeds).fill(false);
  return {
    lit: 0,
    power: powerArray,
    basePower: powerArray,
    toggled: powerArray
  };
}

function LedBoard(props) {

  // Initialize state and dispatch with initial state and a reducer
  const [state, dispatch] = useReducer(reducer, props.count, init);

  // Start the timer
  useEffect(() => {

    const timer = setInterval(() => {
      //dispatch({type: 'tick'});
      //dispatch({type: 'increment'});
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch data
  useEffect(() => {

    const timer = setInterval(() => {
      fetchLedState().then(data => {
      dispatch({type: 'set-data', payload: data});
    });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {
        state.power.map((powered, index) =>
          <Led powered={powered} key={index} onClick={(e) => {
            e.preventDefault();
            toggleRemote(URL, index).then(data => {
              dispatch({type: 'set-data', payload: data});
            }).catch(err => {
              console.log(err)
            });
            //dispatch({type: 'toggle', payload: index});
          }} />
        )
      }
    </>
  );
}

export default LedBoard;