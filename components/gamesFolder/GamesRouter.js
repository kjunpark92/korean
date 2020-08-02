import React from 'react';
import { 
  useRouteMatch,
  Switch,
  Route
} from 'react-router-dom';
import SpellingGameView from './VocabGames/SpellingGameView';
import LevelsSideBar from 'components/levels/LevelsSideBar';
import ImageGameView from './VocabGames/ImageGameView';
import WordGameView from './VocabGames/WordGameView';
import DragDropGameView from './VocabGames/DragDropGameView';
import GrammarMatchingGameView from './GrammarGames/GrammarMatchingGameView';
import GrammarSpellingGameView from './GrammarGames/GrammarSpellingGameView';
import SpeedVocabGameView from './VocabGames/SpeedVocabGameView';


const GamesRouter = () => {
  let { url } = useRouteMatch();

  return (
    <div id="levelsRouter">
      <LevelsSideBar />
      <Switch>
      <Route path={`${url}/GrammarSpellingGameView`} render={(props) => <GrammarSpellingGameView routerHistory={props} />} />
        <Route path={`${url}/GrammarMatchingGameView`} render={(props) => <GrammarMatchingGameView routerHistory={props} />} />
        <Route path={`${url}/SpellingGameView`} render={(props) => <SpellingGameView routerHistory={props} />} />
        <Route path={`${url}/ImageGameView`} render={(props) => <ImageGameView routerHistory={props} />} />
        <Route path={`${url}/WordGameView`} render={(props) => <WordGameView routerHistory={props} />} />
        <Route path={`${url}/DragDropGameView`} render={(props) => <DragDropGameView routerHistory={props} />} />
        <Route path={`${url}/SpeedVocabGameView`} render={(props) => <SpeedVocabGameView routerHistory={props} />} />
      </Switch>
    </div>
  )
}

export default GamesRouter;