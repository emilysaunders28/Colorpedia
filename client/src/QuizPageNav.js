import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom'

const QuizPageNav = (props) => {
    const currentPage = props.currentPage
    const numberOfPages = props.numberOfPages
    const pageList = Array.from(Array(numberOfPages), (_, index) => index + 1);
    const term = props.term
    const nextTerm = props.nextTerm
    const nextTermTitle = props.nextTermTitle
    const type = props.type
    const disabled = props.disabled;

    const url = term==='final' ? `/${term}/` : `/${term}/${type}/`

    const nextPageURL = `${url}${currentPage+1}`
    const previousPageURL = `${url}${currentPage-1}`
    const nextTermUrl = nextTerm === 'final' ? '/final/1' : `/${nextTerm}/learn/1`

    return (
        <Navbar className={term + ' page-nav justify-content-center'} sticky='bottom'>
            <Nav>
            {pageList.map(number => {
                return <Nav.Link 
                    as={Link}
                    key={number}
                    to={`${url}${number}`} 
                    className={`quiz-page-number ${number===currentPage && 'current'}`}
                    disabled={!(number===currentPage)}
                >
                    {number}
                </Nav.Link>
            })}
            {currentPage !== numberOfPages &&
                <Nav.Link as={Link} className='back-next' to={nextPageURL} disabled={disabled}>Next</Nav.Link>
            }
            {currentPage === numberOfPages && term !== 'final' && <Nav.Link as={Link} className='next-term' to={nextTermUrl} disabled={disabled}>{nextTermTitle}</Nav.Link>}
            {currentPage === numberOfPages && term === 'final' && <Nav.Link as={Link} className='next-term' to='/' disabled={disabled}>Home</Nav.Link>}  
            </Nav>
        </Navbar>
    );
}
 
export default QuizPageNav;