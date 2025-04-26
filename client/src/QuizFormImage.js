import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useState } from 'react';

const QuizFormImage = (props) => {
    const options = props.options
    const question = props.question
    
    const handleSubmit = (e) => {
        e.preventDefault()
        props.setSubmitted(true)
        const selected = props.selected
        const data = { selected, question }
        console.log(data)
        console.log(data)
        fetch('/quiz', {
            method: 'POST',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }).then(res => {
            console.log(res)
        })
    }

    const handleRetry = () => {
        props.setSubmitted(false)
        props.setSelected('')
    }

    const handleChange = (e) => {
        props.setSelected(e.target.value)
    }

    return (<Form className='image-form'>
            <Form.Group className="mb-3 row">
                {options.map(option => {
                    return <Col key={option.id}>
                    <Form.Check 
                        type='radio' 
                        className='image-input'
                        disabled={props.submitted}
                        label={
                            <Figure className='quiz-option-image'>
                                <Figure.Image src={option.src}/>
                                <Figure.Caption>
                                    <p dangerouslySetInnerHTML={{ __html: option['caption'] }} />
                                </Figure.Caption>
                            </Figure>
                        }
                        value={option.id}
                        checked={props.selected === option.id}
                        onChange={handleChange}
                    />
                    </Col>
                     
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
 
export default QuizFormImage;