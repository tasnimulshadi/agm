import { useEffect, useState } from "react"
import { useCreateEventMutation } from "../../redux/features/event/eventApi";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function EventCreate() {
    const navigate = useNavigate()

    const [name, setName] = useState('');
    const [agenda, setAgenda] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [sponserInput, setSponserInput] = useState('');
    const [sponser, setSponser] = useState([]);
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [participants, setParticipants] = useState(9888);
    const [present, setPresent] = useState(0);
    const [image, setImage] = useState('');

    const [createEvent, { isLoading, isError, isSuccess }] = useCreateEventMutation();


    useEffect(() => {
        if (isSuccess) {
            navigate('/events');
        }
    }, [isSuccess])

    function addSponser(e) {
        e.preventDefault();
        if (sponserInput) {
            const found = sponser.find(s => s === sponserInput)
            if (!found) {
                setSponser([...sponser, sponserInput])
            }
            setSponserInput('')
        }
    }

    function deleteSponser(e) {
        e.preventDefault()
        const rest = sponser.filter(s => s !== e.target.value)
        setSponser(rest);
    }

    function handleSubmit(e) {
        e.preventDefault();

        createEvent({
            name,
            agenda,
            organizer,
            sponser,
            date: new Date(date).getTime(),
            start: new Date(moment(`${date}T${start}`).format("MM/DD/YYYY hh:mm a")).getTime(),
            end: new Date(moment(`${date}T${end}`).format("MM/DD/YYYY hh:mm a")).getTime(),
            participants,
            present,
            image,
            isDeleted: false
        });
    }

    return (
        <form className='px-10 py-5' onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>Create Event</h1>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    Create Event
                    {
                        isLoading
                            ? <span className="loading loading-spinner"></span>
                            : <FaPlus />
                    }
                </button>
            </div>

            <div className="divider">Create Event</div>

            <div className="flex justify-evenly w-full gap-5">

                <div className="w-1/2">
                    {/* name */}
                    <div className="label">
                        <span className="label-text text-lg font-semibold">Event Name</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {/* agenda */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event Agenda</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={agenda}
                        onChange={(e) => setAgenda(e.target.value)}
                        required
                    />

                    {/* organizer */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event Organizer</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        required
                    />

                    {/* sponser */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event Sponser</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pb-2">
                        {
                            sponser.map((s, i) => <div key={i}>
                                <button className="btn no-animation btn-sm" onClick={deleteSponser} value={s}>{s}</button>
                            </div>)
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered"
                            value={sponserInput}
                            onChange={(e) => setSponserInput(e.target.value)}
                        />

                        <button className="btn" onClick={addSponser}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </div>
                </div>



                <div className="w-1/2 ">
                    {/* date */}
                    <div className="label">
                        <span className="label-text text-lg font-semibold">Event Date</span>
                    </div>
                    <input
                        type="date"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    {/* start */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event Start Time</span>
                    </div>
                    <input
                        type="time"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                    />

                    {/* end */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event End Time</span>
                    </div>
                    <input
                        type="time"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                    />

                    {/* image */}
                    <div className="label mt-3">
                        <span className="label-text text-lg font-semibold">Event Image</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                    <img src={image} alt={name} className="w-96 mt-3 rounded-md" />
                </div>






            </div>
        </form>
    )
}

export default EventCreate