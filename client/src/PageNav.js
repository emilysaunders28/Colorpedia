import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

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
            {currentPage !== 1 && <Nav.Link className='back-next' href={previousPageURL}>Back</Nav.Link>}
            {pageList.map(number => {
                return <Nav.Link key={number} href={`${url}${number}`} className={`page-number ${number===currentPage && 'current'}`}>{number}</Nav.Link>
            })}
            {currentPage === numberOfPages ? <Nav.Link className='quiz' href={quizUrl}>Quiz</Nav.Link> : <Nav.Link className='back-next' href={nextPageURL}>Next</Nav.Link>}
            </Nav>
        </Navbar>
    );
}
 
export default PageNav;