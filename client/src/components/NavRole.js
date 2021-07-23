import { Nav } from 'react-bootstrap';

const NavRole = (props) => {
    const { onSelect } = props;
    return (
        <Nav className='nav-role' variant="pills" defaultActiveKey="P" >
            <Nav.Item>
                <Nav.Link
                    eventKey="P"
                    onSelect={() => onSelect('P')}>
                    P
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="D"
                    onSelect={() => onSelect('D')}>
                    D
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="C"
                    onSelect={() => onSelect('C')}>
                    C
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey="A"
                    onSelect={() => onSelect('A')}>
                    A
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default NavRole;