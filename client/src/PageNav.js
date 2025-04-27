import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'

const PageNav = (props) => {
    const currentPage = props.currentPage
    const numberOfPages = props.numberOfPages
    const pageList = Array.from(Array(numberOfPages), (_, index) => index + 1);
    const term = props.term
    const type = props.type

    const url = term === 'final' ? `/${term}/` : `/${term}/${type}/`

    const nextPageURL = `${url}${currentPage+1}`
    const previousPageURL = `${url}${currentPage-1}`
    const quizUrl = `/${term}/quiz/1`


    return (
        <Navbar className={'page-nav justify-content-center ' + term} sticky='bottom'>
            <Nav>
            {currentPage !== 1 && (
                <Nav.Link as={Link} className='back-next' to={previousPageURL}>
                    Back
                </Nav.Link>
            )}
            {pageList.map(number => {
                return <Nav.Link as={Link} key={number} to={`${url}${number}`} className={`page-number ${number===currentPage ? 'current' : ''}`}>{number}</Nav.Link>
            })}
            {currentPage === numberOfPages ? 
                <Nav.Link as={Link} className='quiz' to={quizUrl}>
                    Quiz
                </Nav.Link> : 
                <Nav.Link as={Link} className='back-next' to={nextPageURL}
                    >Next
                </Nav.Link>}
            </Nav>
        </Navbar>
    );
}

export default PageNav;