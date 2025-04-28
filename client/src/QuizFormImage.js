import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useEffect, useState } from 'react';

const QuizFormImage = (props) => {
    const options = props.options;
    const question = props.question;
    const userInfo = props.userInfo;
    const setUserInfo = props.setUserInfo;
    const [selected,setSelected] = useState(props.selected);
    const [submitted, setSubmitted] = useState(Boolean(selected));

    useEffect(() => {
        setSelected(props.selected)
        setSubmitted(Boolean(props.selected))
        }
        , [props.selected])

    
    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        const data = { selected, question }

        fetch('/quiz', {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }).then(res => {
            if(!res.ok) {
              throw Error('Error submitting quiz');
            }
            return res.json();
          })
          .then((data) => {
            setUserInfo(data['data'])
          })
          .catch(err => {
            console.log(err.message);
          });
    }

    const handleRetry = () => {
        setSubmitted(false)
        setSelected('')
    }

    const handleChange = (e) => {
        setSelected(e.target.value)
    }

    return (<Form className='image-form'>
            <Form.Group className="mb-3 row">
                {options.map(option => {
                    return <Col key={option.id}>
                    <Form.Check 
                        type='radio' 
                        className='image-input'
                        disabled={submitted}
                        label={
                            <Figure className='quiz-option-image'>
                                <Figure.Image src={option.src}/>
                                <Figure.Caption>
                                    <p dangerouslySetInnerHTML={{ __html: option['caption'] }} />
                                </Figure.Caption>
                            </Figure>
                        }
                        value={option.id}
                        checked={selected === option.id}
                        onChange={handleChange}
                    />
                    </Col>
                     
                })}
            </Form.Group>
            <Row>
            {submitted && selected && options[selected] && selected === options[selected].id &&
                <div className={options[selected].correct ? 'correct feedback' : 'incorrect feedback'}>
                    {options[selected].explanation}
                </div>
            }
            </Row>
            <Row>
            {!submitted && <Button className='quiz-button' type='submit' onClick={handleSubmit} disabled={!Boolean(selected)}>Submit</Button>}

            {submitted && selected && options[selected] && !options[selected].correct &&
                <Button className='quiz-button' onClick={handleRetry}>Retry</Button>
            }
            </Row>
        </Form>
    );
}
 
export default QuizFormImage;