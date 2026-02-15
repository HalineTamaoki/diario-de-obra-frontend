import React from 'react';
import { Spinner } from 'react-bootstrap';

export const LoadingContainer = ({isLoading, children, className}: { isLoading: boolean, children: React.ReactNode, className?: string }) => {
    return isLoading ? (
        <div className={`flex w-full ${className ?? ''}`}>
            <Spinner className='text-(--secondary) border-2'/>
        </div>
    ) : children
}
