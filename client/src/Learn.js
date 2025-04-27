import Sidebar from "./Sidebar";
import PageNav from "./PageNav";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Media from './Media';
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";

const Learn = (props) => {
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
    const { page } = useParams();
    const term = props.term
    const { data: content, isPending, error } = useFetch('/data/learn/' + term);

    return (  
        <>
            {/* <MyNav user={userInfo['user']} term={term}/> */}
            <div className="flex">
                <Sidebar term={term} type={'learn'} userInfo={userInfo} setUserInfo={setUserInfo} />
                <div id='content'>
                    { !content && isPending ? <h1>Loading Page...</h1> : <h1>{error}</h1> }
                    { !error && content && Object.keys(content).length + 1 > page &&
                            <Container className="learn-quiz-container">
                                <Row className="header-row">
                                    <h1 className='term-header'>{content[page].title}</h1> 
                                    <h1 className='type-header'>Learn</h1>
                                </Row>
                                <Row>
                                    <div className="learn-text">{content[page].text}</div>
                                </Row>
                                <Row>
                                    <Media term={term} media={content[page].media} page={page}/>
                                </Row>
                            </Container>
                    }
                    { content && <PageNav currentPage={parseInt(page)} term={term} numberOfPages={Object.keys(content).length} type={'learn'}/>}
                </div>
            </div>
        </>
    );
}
 
export default Learn;