import React, { useCallback, useState } from 'react';
import { Button, Dropdown, Offcanvas } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import { AcoesButtonItens } from './AcoesButtonItens';

export const AcoesButton = ({color, itens}: {color?: string, itens: AcoesButtonItens[]}) => {
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
        e.preventDefault();
    }, []);

    return (
    <>
        {isMobile ? (
            <div>
                <Button variant="button" onClick={handleShow} id="acoes-btn" onMouseDown={e => e.preventDefault()} className='py-2'>
                    <BsThreeDots className={color}/>
                </Button>

                {show && (
                    <div onClick={onClick}>
                        <Offcanvas className='offcanvas-autoheight h-auto!' show={show} onHide={handleClose} placement="bottom">
                            <Offcanvas.Title></Offcanvas.Title>
                            <Offcanvas.Body className='gap-3 grid'>
                                <AcoesButtonItens itens={itens} handleClose={handleClose}/>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                )}
            </div>
        ) : (
            <Dropdown show={show} onClick={onClick} onToggle={setShow}>
                <Dropdown.Toggle 
                    variant="button" 
                    id="acoes-btn"
                >
                    <BsThreeDots className={color}/>
                </Dropdown.Toggle>

                <Dropdown.Menu onMouseDown={e => e.preventDefault()}>
                    <div className='py-1 px-2'>
                        <AcoesButtonItens itens={itens} handleClose={handleClose}/>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        )}
        </>
    );
}
