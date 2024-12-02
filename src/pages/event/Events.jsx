import moment from 'moment'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../../components/event/EventCard';
import { useGetEventsQuery } from '../../redux/features/event/eventApi';
import Loading from "../../components/ui/loading/Loading"
import Error from "../../components/ui/error/Error"
import { FaPlus } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { data } from 'autoprefixer';
// flex-grow-0 flex-shrink-0 basis-[calc(33%-1.25rem)]


function Events() {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const { data: events, isError, isLoading, isSuccess } = useGetEventsQuery();

    let content = null
    if (isLoading) {
        content = <Loading />
    }
    else if (!isLoading && isError) {
        content = <Error />
    }
    else if (!isLoading && !isError && events?.length === 0) {
        content = <Error message='No Events Found...' />

    }
    else if (!isLoading && !isError && events?.length > 0) {
        content = <div className='flex gap-5 mt-5 flex-wrap'>
            {
                [...events]
                    .sort((a, b) => b.date - a.date)
                    .map((event, index) => <EventCard key={index} event={event} />)
            }
        </div>
    }


    return (
        <div className='px-10 py-5'>
            {
                user.level === 1 &&
                <button className="btn btn-primary" onClick={() => navigate('/event-create')}>
                    Create Event
                    <FaPlus />
                </button>
            }

            {/* List */}
            {content}
        </div>
    )
}

export default Events