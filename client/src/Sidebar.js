import Accordion from 'react-bootstrap/Accordion';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = (props) => {
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
    const quizData = userInfo['quiz_data']
    const progress = quizData['progress']
    const [activeType, setActiveType] = useState(props.type)
    const [accordionKey , setAccordionKey] = useState(props.term === 'final' ? null: props.term)
    const terms = ['Hue', 'Shade', 'Tint', 'Tone', 'Chroma/Saturation', 'Value', 'Contrast']
    const termsUrl = ['hue', 'shade', 'tint', 'tone', 'chroma_saturation', 'value', 'contrast']
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault()
        fetch('/logout').then(() => {
          setUserInfo({"user" : null})
          navigate('/login')
        })
    }



    useEffect(() => {
        setAccordionKey(props.term === 'final' ? null: props.term)
        setActiveType(props.type)
        }
    , [props.term, props.type])


    return ( 
        <div className={"sidebar " + props.term}>
            <Link to='/'>
                <img src="/styling_images/static_logo2.png" alt="logo" className='sidebar-logo'></img>
            </Link>
            <Accordion 
                activeKey={accordionKey}
                onSelect={(eventKey) => setAccordionKey(eventKey)} 
                flush
            >
                <Accordion.Item>
                    <Accordion.Header className='logged-in-sidebar'>
                    <i className="bi bi-person-circle sidebar-icon"></i>{userInfo['user']}
                    </Accordion.Header>
                    <Accordion.Body>
                        <div onClick={handleLogout} className='sidebar-link'>
                            Logout
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {terms.map((term, index) => {
                    return (
                        <Accordion.Item 
                            eventKey={termsUrl[index]} 
                            key={index}
                        >
                            <Accordion.Header><i className={progress[termsUrl[index]] ? "bi bi-check-circle-fill sidebar-icon" : "bi bi-check-circle sidebar-icon"}></i> {term}</Accordion.Header>
                            <Accordion.Body>
                                <Link to={`/${termsUrl[index]}/learn/1`}>
                                    <div className={`sidebar-link ${props.term === termsUrl[index] && activeType === 'learn' ? 'active' : ''}`}>
                                        Learn
                                    </div>
                                </Link>
                                <Link to={`/${termsUrl[index]}/quiz/1`}>
                                    <div className={`sidebar-link ${props.term === termsUrl[index] && activeType === 'quiz' ? 'active' : ''}`}>
                                    Quiz 
                                    </div>
                                </Link>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
                <Link to="/final/1">
                    <div className="final-quiz-sidebar"><i className={progress['final'] ? "bi bi-check-circle-fill sidebar-icon" : "bi bi-check-circle sidebar-icon"}></i> Final Quiz</div>
                </Link>
            </Accordion>
        </div>
    );
}

export default Sidebar;