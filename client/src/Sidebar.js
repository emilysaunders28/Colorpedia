import Accordion from 'react-bootstrap/Accordion';

const Sidebar = (props) => {
    const userInfo = props.userInfo
    const quizData = userInfo['quiz_data']
    const progress = quizData['progress']
    const activeTerm = props.term
    const activeType = props.type
    const terms = ['Hue', 'Shade', 'Tint', 'Tone', 'Chroma/Saturation', 'Value', 'Contrast']
    const termsUrl = ['hue', 'shade', 'tint', 'tone', 'chroma_saturation', 'value', 'contrast']

    const handleLogout = (e) => {
        e.preventDefault()
        fetch('/logout').then(() => {
          window.location.href = '/login'
        })
    }
    return ( 
        <div className={"sidebar " + props.term}>
            <a href='/'>
                <img src="/styling_images/static_logo2.png" alt="logo" className='sidebar-logo'></img>
            </a>
            <Accordion defaultActiveKey={activeTerm} flush>
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
                        <Accordion.Item eventKey={termsUrl[index]} key={index}>
                            <Accordion.Header><i className={progress[termsUrl[index]] ? "bi bi-check-circle-fill sidebar-icon" : "bi bi-check-circle sidebar-icon"}></i> {term}</Accordion.Header>
                            <Accordion.Body>
                                <a href={`/${termsUrl[index]}/learn/1`}>
                                    <div className='sidebar-link'>
                                        Learn
                                    </div>
                                </a>
                                <a href={`/${termsUrl[index]}/quiz/1`}>
                                    <div className='sidebar-link'>
                                    Quiz 
                                    </div>
                                </a>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
                <a href="/final/1">
                    <div className="final-quiz-sidebar"><i className={progress['final'] ? "bi bi-check-circle-fill sidebar-icon" : "bi bi-check-circle sidebar-icon"}></i> Final Quiz</div>
                </a>
            </Accordion>
        </div>
    );
}

export default Sidebar;