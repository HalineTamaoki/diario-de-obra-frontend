import React, { useCallback, useState } from 'react';
import { Button, Dropdown, Offcanvas } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';

export const AcoesButton = ({color, children}: {color?: string, children: React.ReactNode}) => {
    const [show, setShow] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const handleClose = useCallback(() => {
        setShow(false);
    }, []);

    const handleShow = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setShow(true);
    }, []);

    const onClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        handleClose();
    }, []);

    return (
    <>
        {isMobile ? (
            <div>
                <Button variant="button" onClick={handleShow} id="acoes-btn" >
                    <BsThreeDots className={color}/>
                </Button>

                {show && (
                    <div onClick={onClick}>
                        <Offcanvas className='offcanvas-autoheight h-auto!' show={show} onHide={handleClose} placement="bottom">
                            <Offcanvas.Title></Offcanvas.Title>
                            <Offcanvas.Body className='gap-3 grid'>
                                {children}
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                )}
            </div>
        ) : (
            <Dropdown onClick={onClick} >
                <Dropdown.Toggle 
                    variant="button" 
                    id="acoes-btn"
                    className=''
                >
                    <BsThreeDots className={color}/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item id='acoes-obra-deletar'>
                        {children}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )}
        </>
    );
}
