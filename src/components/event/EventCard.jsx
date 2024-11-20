import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function EventCard({ event }) {
    const navigate = useNavigate();
    const { id, name, agenda, organizer, sponser, date, start, end, participants, present, image } = event;

    return (
        <div className="card bg-base-100 flex-grow-0 flex-shrink-0 basis-[calc(25%-1.25rem)] shadow-xl">
            <figure>
                <img
                    src={image}
                    alt={name}
                    className='h-60 w-full'
                />
            </figure>
            <div className="card-body">
                <h1 className="card-title">{name}</h1>
                <h2>{agenda}</h2>
                <p><span className='capitalize font-bold'>Organizer: </span>{organizer}</p>
                <p><span className='capitalize font-bold'>Sponser: </span>{sponser.map((s, i) => <span key={i}>{s}{sponser.length - 1 === i ? '' : ', '}</span>)}</p>
                <p><span className='capitalize font-bold'>Date: </span>{moment(date).format('LL')}</p>
                <p><span className='capitalize font-bold'>Time: </span>{moment(start).format('LT')} - {moment(end).format('LT')}</p>
                <p><span className='capitalize font-bold'>Participants: </span>{participants}</p>
                <p><span className='capitalize font-bold'>Present: </span>{present}</p>

                <div className="card-actions justify-end">
                    <button className="btn btn-neutral" onClick={() => navigate(`/event-edit/${id}`)}>Edit</button>
                    <button className="btn btn-primary" onClick={() => navigate(`/present/${id}`)}>Attendance</button>
                    <button className="btn btn-secondary" onClick={() => navigate(`/vote/${id}`)}>Vote</button>
                </div>
            </div>
        </div>
    )
}

export default EventCard