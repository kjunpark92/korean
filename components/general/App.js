import React from 'react';
import { 
  BrowserRouter,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import Navbar from 'components/navbar/Navbar';
import LandingPage from 'components/landingPage/LandingPage';
import UserProfilePage from 'components/userProfilePage/UserProfilePage';
import StaffProfilePage from 'components/staffFolder/StaffProfilePage';
import CoursesRouter from 'components/courses/CoursesRouter';
import LevelsRouter from 'components/levels/LevelsRouter';
import GamesRouter from 'components/gamesFolder/GamesRouter';
import ContactUs from './ContactUs';
import Footer from './Footer';
import jejuGate from 'assets/images/jejuGate.png';
import LevelTestView from 'components/levelTestFolder/LevelTestView';
import ResourcesView from './ResourcesView';
import { withCookies } from 'react-cookie';
import ScrollToTop from 'components/general/ScrollToTop';
import Levels from 'components/levels/Levels';
import {Helmet} from "react-helmet";
import EntertainmentMainView from 'components/hallyuFolder/EntertainmentMainView';
import MemoryBank from './MemoryBank';

//When using cookies:
//If using Route component (e.g. <Route path="/UserProfilePage" component={UserProfilePage} />)
//Must change it to render{(....)} 
//If that component does not require cookies, it does not need to change
class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Helmet>
          <title>Raw Korean</title>
        </Helmet>
        <ScrollToTop />
        <Navbar cookies={this.props.cookies}/>
        <Switch>
          <Route exact path="/" render={() => (<LandingPage cookies={this.props.cookies}/>)} />
          <Route path="/UserProfilePage" component={UserProfilePage} />
          <Route path="/StaffProfilePage" component={StaffProfilePage} />
          <Route path="/ContactUs">
            <ContactUs />
          </Route>
          <Route path="/Levels" component={Levels} />
          <Route path="/LevelsRouter" component={LevelsRouter} />
          <Route path="/GamesRouter" component={GamesRouter} />
          <Route path="/CoursesRouter" component={CoursesRouter} />
          <Route path="/EntertainmentMainView" component={EntertainmentMainView} />
          <Route path="/LevelTestView">
            <LevelTestView />
          </Route>
          <Route path="/ResourcesView">
            <ResourcesView />
          </Route>
          <Route path="/MemoryBank">
            <MemoryBank />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
        <Footer /> 
      </BrowserRouter>
    )
  }
}
 

export default withCookies(App);

//For 404
function NoMatch() {
  let location = useLocation();

  return (
    <div id="pageNotFound">
      <h3>
        Page Not Found: {location.pathname}
      </h3>
      <img src={jejuGate} alt="Jeju wooden gate" id="imagePageNotFound"/>  
    </div>
  );
}