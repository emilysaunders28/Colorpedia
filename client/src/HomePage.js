import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useNavigate, Link } from "react-router-dom";

const HomePage = (props) => {
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
    const quizData = userInfo['quiz_data']
    const progress = quizData['progress']
    const titles = ['Hue', 'Shade', 'Tint', 'Tone', 'Chroma', 'Value', 'Contrast']
    const urls = ['hue', 'shade', 'tint', 'tone', 'chroma_saturation', 'value', 'contrast']
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        fetch('/logout', {
          method: 'GET',
          credentials: 'include'
        }).then(() => {
          setUserInfo({"user" : null});
          navigate('/login');
        });
      };

    return (
        <>
            <Container id="homepage">
                <Row className="homepage-user-info">
                    <Col className="logged-in-as d-flex align-items-center">Logged in as {userInfo['user']}</Col>
                    <Col className="homepage-logout-col"><button className="btn homepage-logout" onClick={handleLogout}>Logout</button></Col>
                </Row>
                <Row >
                    <Col className="header-col">
                        <h6>Welcome to</h6>
                        <img src="/styling_images/static_logo2.png" className="logo-image"></img>
                        <div className="homepage-intro">
                            A website to learn color theory terminology. Click the button or select a term below to get started.
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Link to="/hue/learn/1">
                        <button className="btn btn-lg homepage-button">Start Learning</button>
                    </Link>
                </Row>
                <Row className="homepage-nav-row">
                    {titles.map((term, index) => {
                        return (
                            <Col xs={4} md={3} xl={2} key={index}>
                                <div className="homepage-nav">
                                    <Row className="homepage-nav-title">
                                        <h2><i className={progress[urls[index]] ? "bi bi-check-circle-fill" : "bi bi-check-circle"}></i></h2><h2>{term}</h2>
                                    </Row>
                                    <Row className="homepage-nav-links">
                                        <Link to={`/${urls[index]}/learn/1`}>Learn</Link>
                                        <Link to={`/${urls[index]}/quiz/1`}>Quiz</Link>
                                    </Row>
                                </div>
                            </Col>
                        )
                    })}
                    <Col xs={4} md={3} xl={2}>
                        <div className="homepage-nav final">
                            <Row className="homepage-nav-title">
                                <Link to="/final/1">
                                <h2><i className={progress['final'] ? "bi bi-check-circle-fill" : "bi bi-check-circle"}></i></h2><h2>Final Quiz</h2>
                                </Link>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
        
     );
}
 
export default HomePage;