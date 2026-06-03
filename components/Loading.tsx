import React from 'react'

function Loading() {
    return (
        <div className="page-form">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );
}

export default Loading