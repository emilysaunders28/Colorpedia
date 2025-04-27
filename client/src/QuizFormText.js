import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import { useState, useEffect } from 'react';

const QuizFormText = (props) => {
    const [options, setOptions] = useState(props.options)
    const question = props.question
    const userInfo = props.userInfo
    const setUserInfo = props.setUserInfo
    const selected = props.selected
    
        useEffect(() => {
            setOptions(props.options)
        }
            , [props.options])

    const handleSubmit = (e) => {
        e.preventDefault()
        props.setSubmitted(true)
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
        props.setSubmitted(false)
        props.setSelected('')
    }

    const handleChange = (e) => {
        props.setSelected(e.target.value)
    }

    return (
        <Form >
            <Form.Group className="mb-3">
                {options.map(option => {
                    return <Form.Check 
                        type='radio' 
                        className='quiz-option-text'
                        disabled={props.submitted}
                        key={option.id}
                        label={option.text}
                        value={option.id}
                        checked={props.selected === option.id}
                        onChange={handleChange}
                    />
                })}
            </Form.Group>
            <Row>
                {props.submitted && props.selected===options[props.selected].id &&
                    <div className={options[props.selected].correct ? 'correct feedback' : 'incorrect feedback'}>
                        {options[props.selected].explanation}
                    </div>
                }
            </Row>
            <Row>
                {!props.submitted && <Button className='quiz-button' type='submit' onClick={handleSubmit} disabled={!Boolean(props.selected)}>Submit</Button>}
                {props.submitted && !options[props.selected].correct && <Button className='quiz-button' onClick={handleRetry} >Retry</Button>}
            </Row>
        </Form>
    );
}
 
export default QuizFormText;