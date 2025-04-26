import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/esm/Image';
import { useState,useEffect } from 'react';

const Media = (props) => {
    const [current, setCurrent] = useState(0)
    const media = props.media
    const term = props.term
    const currentMedia = media[current]
    const caption = currentMedia.caption
    const description = currentMedia.description
    const alt = currentMedia.alt
    const src = currentMedia.src
    const url = window.location.href
    

    const handleClick = (index,event) => {
        event.preventDefault()
        setCurrent(index)
    }

    return (
        <>
            <Card className={'my-card ' + term}>
            <Card.Header>
                <Nav className={term} variant="tabs" defaultActiveKey={`${url}/#${current}`}>
                {media.map((media,index) => {
                    return (
                        <Nav.Item key={index}> 
                            <Nav.Link href={`${url}/#${index}`} onClick={(event) => handleClick(index,event)}>{`Example ${index + 1}`}</Nav.Link>
                        </Nav.Item>
                    )
                })}
                </Nav>
            </Card.Header>
                <Card.Body>
                    <Card.Text>
                        {description}
                    </Card.Text>
                    <Card.Subtitle className="mb-2 text-muted">
                        <p dangerouslySetInnerHTML={{ __html: caption }} />
                    </Card.Subtitle>
                    <div className="center">
                        <Image src={src} alt={alt} fluid></Image>
                    </div>
                </Card.Body>
                {/* <Card.Img variant="bottom" src={src} alt={alt}/> */}
            </Card>
        </>
    );
}
 
export default Media;