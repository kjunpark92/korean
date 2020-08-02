import React from 'react';
import { faHeart} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {uuid} from 'uuidv4';
import axios from 'axios';
import {vocabGroupsData} from 'assets/data/vocabGroupsData';


//Shuffle a given array
export function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//Generate the number of hearts based on livesAvailable
export function GameLives(props) {
  const heartDecrease = props.heartDecrease ? 'heartDecrease' : '';

  let currentLives= props.lives;
  let totalLives = [];
  for (let i =0; i <currentLives; i++) {
      let heart = <FontAwesomeIcon className={`gameHearts ${heartDecrease}`} icon={faHeart} key={uuid()}/>
      totalLives.push(heart);
  }
  if(props.lives >=1 ){
    return (
    
      <span >
          {totalLives}
      </span>
    )
  } else {
    return (
      <span className="gameOverDisplay">You ran out of hearts!</span>
    )
  }

}

export function replayGame() {
  //Reload the entire window
  window.location.reload(false);
}

//Divide an array into groups/chunks (e.g. an array into groups of 4)
export function chunkArray(myArray, arrayChunk){
  let arrayLength = myArray.length;
  let tempArray = [];
  for (let i = 0; i < arrayLength; i += arrayChunk) {
      let myChunk = myArray.slice(i, i+arrayChunk);
      tempArray.push(myChunk);
  }
  return tempArray;
}

//this takes the existing this.props.items from vocab games 
//to increase or decrease the array
export function gameLengthening(props) {
  let existingArray = props;
  let addedArray = props;
  let finalArray = [];

  if (existingArray.length < 21){
    //If the array is too short, concat it
    finalArray = existingArray.concat(addedArray, addedArray,addedArray, addedArray, addedArray, addedArray);

    //If the array becomes too long, slice it down
    if(finalArray.length > 21){
      let slicedArray = finalArray.slice(0,21);
      return slicedArray
    } else {
      return finalArray
    }

  } else { //This should only be reached at higher levels, not level 1 vocab
    let slicedArray = existingArray.slice(0,21);
    return slicedArray
  }

}

//Update the score
export function sendUpdateScore(props, score) {
  const username = props.userData.username;
  const updatedRank = score + props.userData.rank;
  const fd = new FormData();
  fd.append('username', username);
  fd.append('level', props.level);
  fd.append('gameName', props.gameName);
  fd.append('score', score);
  fd.append('updatedRank', updatedRank);

  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
  }
  axios.post('https://kiipgrammar.com/backend/updateScoreboard.php', fd, headers
  ).then(res=>
      {
        // alert(res.data);
      }
  );
}

//Extend the game in the gameView
export function extendGameVocabularyList(props){
  //The below code is to increase the vocab list to make 20 questions
  let existingArray = props;
  let addedArray = props;
  let finalArray = [];

  if (existingArray.length < 81){
    //If the array is too short, concat it
    finalArray = existingArray.concat(addedArray, addedArray, addedArray, addedArray);

    //If the array becomes too long, slice it down
    if(finalArray.length > 81){
      let slicedArray = finalArray.slice(0,81);
      const vocabulary = shuffle(slicedArray);
      return vocabulary
    } else {
      return shuffle(finalArray)
    }

    // return vocabulary
  } else { //This should only be reached at higher levels, not level 1 vocab
    let slicedArray = existingArray.slice(0,81);
    const vocabulary = shuffle(slicedArray);
    return vocabulary
  }
}

//Random number generator
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Load the vocab groups for the vocab games
export function getOptionsData(props) {
  const vocabGroups = vocabGroupsData;
  let vocabGroupArray = [];
  for(let i = 0; i < vocabGroups.levels.length; i++){
    // eslint-disable-next-line eqeqeq 
    if(vocabGroups.levels[i].level == props){
      vocabGroupArray.push(vocabGroups.levels[i].vocab_group)
    }
  }

  const vocabGroupOptions = vocabGroupArray.map((vocabGroup, groupNumber) => {
    return(
    <option 
      className={`gameSelectOptions`}
      key={uuid()} name="selectedUnits" 
      value={groupNumber}
    >
      {vocabGroup}
    </option>
    )
  })

  return vocabGroupOptions;
}

//Display the incorrect answers in a table
export function incorrectAnswersDisplayTable (props){
  return (
    <div className="incorrectAnswersTable">
    <h4>Incorrect Answers:</h4>
    <table>
      <thead>
        <tr>
          <th>English</th>
          <th>Korean</th>
        </tr>
      </thead>
      <tbody>
        {props.map((incorrect) => {
        return (
          <tr key={uuid()}>
            <td>{incorrect[0]}</td>
            <td>{incorrect[1]}</td>
          </tr>
        )
      })}
      </tbody>
    </table>

  </div>
  )
}