import React from 'react'

function Error({ message = "Some Error Occurred!" }) {
    return (
        <div className='h-96 w-screen flex justify-center items-center'>
            <span className='text-xl mr-5'>Error: {message}</span>
        </div>
    )
}

export default Error