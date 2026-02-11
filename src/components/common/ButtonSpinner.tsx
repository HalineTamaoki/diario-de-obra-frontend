import { Spinner } from "react-bootstrap"

export const ButtonSpinner = ({loading}: {loading?: boolean}) => {
    return loading && <Spinner animation="border" size="sm" className="ml-2"/>
}
