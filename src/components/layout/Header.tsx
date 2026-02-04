import { BsBoxArrowRight } from "react-icons/bs"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useCallback } from "react";
import { logout } from "../../features/authSlice";

export const Header = () => {
    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => dispatch(logout()), []);

    return (
        <header className='bg-(--main) h-10 w-full fixed top-0 left-0 z-50 flex justify-end' >
            <button onClick={handleLogout}>
                <BsBoxArrowRight className=""/>
            </button>
        </header>
    )
}
