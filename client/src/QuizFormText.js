import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import { useState, useEffect } from 'react';

const QuizFormText = (props) => {
    const options = props.options;
    const question = props.question
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
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

        userInfo['quiz_data']['quiz'][props.term][parseInt(props.page)-1] = selected
        setUserInfo(userInfo)

        fetch('/quiz', {
            method: 'POST',
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

    return (
        <Form >
            <Form.Group className="mb-3">
                {options.map(option => {
                    return <Form.Check 
                        type='radio' 
                        className='quiz-option-text'
                        disabled={submitted}
                        key={option.id}
                        label={option.text}
                        value={option.id}
                        checked={selected === option.id}
                        onChange={handleChange}
                    />
                })}
            </Form.Group>
            <Row>
                {submitted && selected && selected===options[selected].id &&
                    <div className={options[selected].correct ? 'correct feedback' : 'incorrect feedback'}>
                        {options[selected].explanation}
                    </div>
                }
            </Row>
            <Row>
                {!submitted && <Button className='quiz-button' type='submit' onClick={handleSubmit} disabled={!Boolean(selected)}>Submit</Button>}
                {submitted && !options[selected].correct && <Button className='quiz-button' onClick={handleRetry} >Retry</Button>}
            </Row>
        </Form>
    );
}
 
export default QuizFormText;