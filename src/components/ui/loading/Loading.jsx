import React from 'react'

function Loading() {
    return (
        <div className='h-96 w-screen flex justify-center items-center'>
            <span className='text-xl mr-5'>Loading</span>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    )
}

export default Loading