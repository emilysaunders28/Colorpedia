import Sidebar from "./Sidebar";
import QuizPageNav from "./QuizPageNav";
import QuizFormImage from "./QuizFormImage";
import QuizFormText from "./QuizFormText";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';
import useFetch from "./useFetch";
import Figure from 'react-bootstrap/Figure'
import { useParams } from "react-router-dom";
import { useState, useEffect, use } from 'react';

const Quiz = (props) => {
    const userInfo = props.userInfo;
    const setUserInfo = props.setUserInfo;
    const quizData = userInfo['quiz_data'];
    const [term, setTerm] = useState(props.term);
    const { page } = useParams();

    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState(null);

    const titles = {"hue": "Hue", "shade": "Shade", "tint": "Tint", "tone": "Tone", "chroma_saturation": "Chroma/Saturation", "value": "Value", "contrast": "Contrast", "final": "Final Quiz", "none": ""}
    const nextTerm = {"hue": "shade", "shade": "tint", "tint": "tone", "tone": "chroma_saturation", "chroma_saturation": "value", "value": "contrast", "contrast": "final", "final" : "none"}


    const fetchQuestions = () => {
        setIsPending(true);
        fetch('/data/quiz/' + term, {
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
            setQuestions(data['data'])
            setIsPending(false);
            setError(null);
          })
          .catch(err => {
            setError(err.message);
            console.log(error);
          });
      }
      
      useEffect(() => {
        fetchQuestions();
      }
      ,[term]);

    useEffect(() => {
        setTerm(props.term)
        }
    , [props.term])


    if (isPending) {
        return <div>Loading…</div>; 
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="flex">
            <Sidebar term={term} type={'quiz'} userInfo={userInfo} setUserInfo={setUserInfo} />
                <div id='content'>
                    { !questions && isPending ? <h1>Loading Page...</h1> : <h1>{error}</h1> }
                    { !error && questions && Object.keys(questions).length + 1 > page &&
                            <Container className="learn-quiz-container">
                                <Row className="header-row">
                                    <h1 className='term-header'>{titles[term]}</h1>
                                    {term !== 'final' && <h1 className='type-header'>Quiz</h1>}
                                </Row>
                                <Row className="question-text">
                                    <div className="question-number">{`Question ${page}`}</div>
                                    <div className="quiz-text">{questions[page]['question_text']}</div>
                                </Row>
                                <Row className="question-media-row">
                                    {questions[page]['question_media'] && questions[page]['question_media'].map((media, index) => {
                                        return (
                                            <Col key={index} className="question-media-col justify-content-center d-flex">
                                                <Figure className="question-media">
                                                    <Figure.Image src={media['src']}/>
                                                    <Figure.Caption>
                                                        <p dangerouslySetInnerHTML={{ __html: media['caption'] }} />
                                                    </Figure.Caption>
                                                </Figure>
                                            </Col>
                                        )
                                    })}
                                </Row>
                                <Row>
                                    {questions[page]['type']==='image_select' && 
                                    <QuizFormImage 
                                        options={questions[page]['options']} 
                                        question={{"term" : term, "id": page}} 
                                        userInfo={userInfo}
                                        setUserInfo={setUserInfo}
                                        selected={quizData['quiz'][term][parseInt(page)-1]}
                                        page={page}
                                        term={term}
                                    />}
                                    {questions[page]['type']==='multiple_choice' && 
                                    <QuizFormText 
                                        options={questions[page]['options']} 
                                        question={{"term" : term, "id": page}} 
                                        userInfo={userInfo}
                                        setUserInfo={setUserInfo}
                                        selected={quizData['quiz'][term][parseInt(page)-1]}
                                        page={page}
                                        term={term}
                                    />}
                                </Row>
                                { questions && 
                                    <QuizPageNav 
                                        currentPage={parseInt(page)} 
                                        term={term}
                                        numberOfPages={Object.keys(questions).length} 
                                        type={'quiz'} 
                                        options={questions[page]['options']}
                                        disabled={!(userInfo['quiz_data']['quiz'][term][parseInt(page)-1] && questions[page]['options']?.[userInfo['quiz_data']['quiz'][term][parseInt(page)-1]]?.correct)}
                                        nextTerm={nextTerm[term]}
                                        nextTermTitle={titles[nextTerm[term]]}
                                    />
                                }
                            </Container>
                    }
                </div>
            </div>
        </>
    );
}

export default Quiz;