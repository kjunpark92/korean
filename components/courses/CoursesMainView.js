import React from 'react';
import 'style/Courses.css';
import { Link } from 'react-router-dom';
import {uuid} from 'uuidv4';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';

export class CoursesMainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            courses: [{}]
      }
    }   
    
    componentDidMount() {
        const headers = {
            'Content-Type': 'application/json',
        }

        axios.post('https://kiipgrammar.com/backend/getCourseInformation.php', '', headers)
            .then(res => {
            const courses = res.data;
            this.setState({ courses });
        })
        //catch the errors and return a message
        .catch(error => {
            this.setState({ errorMessage: error.toString(), });
            console.error('There was an error!', error);
        });

    }

    render() {
        return (
            <div id="coursesMainView">
                {/* Meta tags */}
                <Helmet>
                    <title>Raw Korean - Korean Courses</title>
                    <meta name="description" content="Fun and helpful Korean courses from beginner to advanced levels 
                    and TOPIK and KIIP prep courses." />
                    <meta name="robots" content="index, follow" />
                    {/* Twitter */}
                    <meta name="twitter:card" value="Find fun and helpful Korean courses for every level! 
                    Improve your Korean listening, speaking, writing, or grammar skills with a Raw Korean course."/>
                    {/* Open Graph */}
                    <meta property="og:title" content="Raw Korean - Korean Courses" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content="http://www.rawkorean.com/CoursesRouter" />
                    <meta property="og:description" content="Find fun and helpful Korean courses for every level! 
                    Improve your Korean listening, speaking, writing, or grammar skills with a Raw Korean course." /> 
                </Helmet>
                <header>
                    <h1 className="coursesText">Courses</h1>
                </header>
                {CoursesFree()}
                <CoursesBeginner coursesProps={this.state.courses}/>
                <CoursesIntermediate coursesProps={this.state.courses}/>
                <CoursesAdvanced coursesProps={this.state.courses}/>
                <CoursesTOPIK coursesProps={this.state.courses}/>
                <CoursesKIIP coursesProps={this.state.courses}/>
            </div>
          )
    }
}

export class CoursesIndividualDisplay extends React.Component {
    render() {
        return (
            <Link to={`/CoursesRouter${this.props.course.courseLink}`}>
                <div className={`coursesIndividualCourses ${this.props.className}`}>
                    <h3>{this.props.course.courseType}</h3>
                    <h3>{this.props.course.courseName}</h3>
                </div>
             </Link>
        )
    }
}

const CoursesFree = () =>  {
    return (
        <div className="coursesWrapper" id="coursesFree">
            <h2>Free Courses</h2>
            <div className="coursesContainer">
                <Link to="/EverdayKoreanCourse">
                    <div className="coursesIndividualCourses">
                        <h3>Beginner</h3>
                        <h3>Everyday Korean</h3>
                    </div>
                </Link>
                <Link to="/TravelKoreanCourse">
                    <div className="coursesIndividualCourses">
                        <h3>Beginner</h3>
                        <h3>Travel Korean</h3>
                    </div>
                </Link>
                <Link to="/LearnHangulCourse">
                    <div className="coursesIndividualCourses">
                        <h3>Beginner</h3>
                        <h3>Learn Hangul</h3>
                    </div>
                </Link>

            </div>
        </div>
    )
}

class CoursesBeginner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          itemsToShow: 3,
          expanded: false
        }
        this.showMore = this.showMore.bind(this);
      }

    showMore() {
        this.state.itemsToShow === 3 ? (
        this.setState({ 
            itemsToShow: this.props.coursesProps.length, 
            expanded: true })
        ) : (
        this.setState({ 
            itemsToShow: 3, 
            expanded: false })
        )
    }
    render() {
        let beginnerArray = [];
        for(let i =0; i < this.props.coursesProps.length; i++) {
            let coursesType = this.props.coursesProps[i].courseType;
            if(coursesType === "Beginner") {
                beginnerArray.push(this.props.coursesProps[i]);
            } 
        } 
        return (
            <div className="coursesWrapper coursesBeginner">
                <h2 className="level1Text">Beginner</h2>
                <div className="coursesContainer">
                    {beginnerArray.slice(0,this.state.itemsToShow).map((course) =>
                        <CoursesIndividualDisplay 
                            key={uuid()}
                            course={course}
                            className="coursesBeginnerIndividual"
                        />
                    )}
                    <button type="button" className="showMoreButton" onClick={this.showMore}>
                        {this.state.expanded ? (
                            <h3>Fewer Courses</h3>
                            ) : (
                                <h3>More Courses</h3>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}
CoursesBeginner.propTypes = {
    coursesProps: PropTypes.array.isRequired
} 

class CoursesIntermediate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          itemsToShow: 3,
          expanded: false
        }
        this.showMore = this.showMore.bind(this);
      }
      showMore() {
        this.state.itemsToShow === 3 ? (
          this.setState({ 
            itemsToShow: this.props.coursesProps.length, 
            expanded: true })
        ) : (
          this.setState({ 
            itemsToShow: 3, 
            expanded: false })
        )
      }
      render() {
        let coursesType = "";
        let intermediateArray = [];
        for(let i =0; i < this.props.coursesProps.length; i++) {
            coursesType = this.props.coursesProps[i].courseType;
            if(coursesType === "Intermediate") {
                intermediateArray.push(this.props.coursesProps[i]);
            } 
        } 
        return (
            <div className="coursesWrapper coursesIntermediate">
                <h2 className="level3Text">Intermediate</h2>
                <div className="coursesContainer">
                    {intermediateArray.slice(0,this.state.itemsToShow).map((course) =>
                        <CoursesIndividualDisplay 
                            key={uuid()}
                            course={course}
                            className="coursesIntermediateIndividual"
                        />
                    )}
                   <button type="button" className="showMoreButton" onClick={this.showMore}>
                        {this.state.expanded ? (
                            <h3>Fewer Courses</h3>
                            ) : (
                                <h3>More Courses</h3>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}
CoursesIntermediate.propTypes = {
    coursesProps: PropTypes.array.isRequired
} 

class CoursesAdvanced extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          itemsToShow: 3,
          expanded: false
        }
        this.showMore = this.showMore.bind(this);
      }
      showMore() {
        this.state.itemsToShow === 3 ? (
          this.setState({ 
            itemsToShow: this.props.coursesProps.length, 
            expanded: true })
        ) : (
          this.setState({ 
            itemsToShow: 3, 
            expanded: false })
        )
      }
      render() {
        let coursesType = "";
        let advancedArray = [];
        for(let i =0; i < this.props.coursesProps.length; i++) {
            coursesType = this.props.coursesProps[i].courseType;
            if(coursesType === "Advanced") {
                advancedArray.push(this.props.coursesProps[i]);
            } 
        } 
        return (
            <div className="coursesWrapper coursesAdvanced">
                <h2 className="level5Text">Advanced</h2>
                <div className="coursesContainer">
                    {advancedArray.slice(0,this.state.itemsToShow).map((course) =>
                        <CoursesIndividualDisplay 
                            key={uuid()}
                            course={course}
                            className="coursesAdvancedIndividual"
                        />
                    )}
                   <button type="button" className="showMoreButton" onClick={this.showMore}>
                        {this.state.expanded ? (
                            <h3>Fewer Courses</h3>
                            ) : (
                                <h3>More Courses</h3>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}
CoursesAdvanced.propTypes = {
    coursesProps: PropTypes.array.isRequired
} 

class CoursesTOPIK extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          itemsToShow: 3,
          expanded: false
        }
        this.showMore = this.showMore.bind(this);
      }
      showMore() {
        this.state.itemsToShow === 3 ? (
          this.setState({ 
            itemsToShow: this.props.coursesProps.length, 
            expanded: true })
        ) : (
          this.setState({ 
            itemsToShow: 3, 
            expanded: false })
        )
      }
    render() {
        let coursesType = "";
        let TOPIKArray = [];
        for(let i =0; i < this.props.coursesProps.length; i++) {
            coursesType = this.props.coursesProps[i].courseType;
            if(coursesType === "TOPIK") {
                TOPIKArray.push(this.props.coursesProps[i]);
            } 
        } 
        return (
            <div className="coursesWrapper coursesTOPIK">
                <h2 className="levelTOPIKText">TOPIK</h2>
                <div className="coursesContainer">
                    {TOPIKArray.slice(0,this.state.itemsToShow).map((course) =>
                        <CoursesIndividualDisplay 
                            key={uuid()}
                            course={course}
                            className="coursesTOPIKIndividual"
                        />
                    )}
                   <button type="button" className="showMoreButton" onClick={this.showMore}>
                        {this.state.expanded ? (
                            <h3>Fewer Courses</h3>
                            ) : (
                                <h3>More Courses</h3>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}
CoursesTOPIK.propTypes = {
    coursesProps: PropTypes.array.isRequired
}  

class CoursesKIIP extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          itemsToShow: 5,
          expanded: false
        }
        this.showMore = this.showMore.bind(this);
      }
      showMore() {
        this.state.itemsToShow === 5 ? (
          this.setState({ 
            itemsToShow: this.props.coursesProps.length, 
            expanded: true })
        ) : (
          this.setState({ 
            itemsToShow: 5, 
            expanded: false })
        )
      }
    render() {
        let coursesType = "";
        let KIIPArray = [];
        for(let i =0; i < this.props.coursesProps.length; i++) {
            coursesType = this.props.coursesProps[i].courseType;
            if(coursesType === "KIIP") {
                KIIPArray.push(this.props.coursesProps[i]);
            } 
        } 
        return (
            <div className="coursesWrapper coursesKIIP">
                <h2 className="levelKIIPText">KIIP</h2>
                <div className="coursesContainer">
                    {KIIPArray.slice(0,this.state.itemsToShow).map((course) =>
                        <CoursesIndividualDisplay 
                            key={uuid()}
                            course={course}
                            className="coursesKIIPIndividual"
                        />
                    )}
                   <button type="button" className="showMoreButton" onClick={this.showMore}>
                        {this.state.expanded ? (
                            <h3>Fewer Courses</h3>
                            ) : (
                                <h3>More Courses</h3>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}
CoursesKIIP.propTypes = {
    coursesProps: PropTypes.array.isRequired
}  