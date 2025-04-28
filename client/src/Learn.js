import Sidebar from "./Sidebar";
import PageNav from "./PageNav";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Media from './Media';
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';

const Learn = (props) => {
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
    const { page } = useParams();
    const [term, setTerm] = useState(props.term)
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [content, setContent] = useState(null);
    console.log(term)

    const fetchContent = () => {
        setIsPending(true);
        fetch('/data/learn/' + term, {
          credentials: 'include',
          method: 'GET',
        })
          .then(res => {
            if(!res.ok) {
              throw Error('Could not fetch data');
            }
            return res.json();
          })
          .then((data) => {
            setContent(data['data'])
            setIsPending(false);
            setError(null);
          })
          .catch(err => {
            setError(err.message);
            console.log(error);
          });
      }

    useEffect(() => {
        setTerm(props.term)
        }
        , [props.term]);
    useEffect(() => {
        fetchContent();
        }
        , [term]);

    if (isPending) {
        return <div>Loading…</div>; 
    }
    if (error) {
        return <div>{error}</div>;
    }

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