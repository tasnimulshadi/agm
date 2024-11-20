import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaList } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import AttendanceTableRow from '../../components/attendance/AttendanceTableRow';
import { useGetAllPresentListQuery, useGetAllShareHoldersQuery } from '../../redux/features/attendance/attendanceApi';
import Loading from "../../components/ui/loading/Loading"
import Error from "../../components/ui/error/Error"
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useGetSingleEventQuery } from '../../redux/features/event/eventApi';
import isCurrentDateTimeBetween from '../../utils/isCurrentDateTimeBetween';

function Attendance() {
    const { eventId } = useParams(); // Extract 'eventId' from the URL parameters using React Router's useParams hook
    const navigate = useNavigate(); // Access the navigation function using React Router's useNavigate hook
    const inputRef = useRef(null); // Create a reference to an input element using the useRef hook

    const [page, setPage] = useState(1) // State for pagination, starts with page 1
    const [search, setSearch] = useState(''); // State for search input, starts with an empty string
    const [name, setName] = useState('');
    const [boid, setBoid] = useState('');
    const [skipping, setSkipping] = useState(false); // State to control whether certain queries should be skipped, starts as false


    // Fetch the data for a single event based on 'eventId'
    const {
        data: eventData,        // The event data fetched from the query
        isLoading: isLoadingEvent, // Boolean indicating if the query is still loading
        isError: isErrorEvent   // Boolean indicating if an error occurred during the query
    } = useGetSingleEventQuery(eventId);

    // Fetch the list of shareholders with optional filters: 'name', 'boid', and 'page'
    const {
        data,                   // The data for all shareholders fetched from the query
        isLoading,              // Boolean indicating if the query is still loading
        isError,                // Boolean indicating if an error occurred during the query
    } = useGetAllShareHoldersQuery({ name, boid, page }, {
        skip: !skipping         // Skip the query execution if 'skipping' is false
    });

    // Fetch the list of present users for the given event
    const {
        data: presentList,      // The data for the present list fetched from the query
        isLoading2,             // Boolean indicating if the query is still loading
        isError2,               // Boolean indicating if an error occurred during the query
    } = useGetAllPresentListQuery(eventId, {
        skip: !skipping         // Skip the query execution if 'skipping' is false
    });


    useEffect(() => {
        // Check if the event data is no longer loading
        if (!isLoadingEvent) {
            // If there is no valid event ID in the event data, navigate to the '/events' page
            if (!eventData?.id) {
                navigate('/events');
            } else {
                // Check if the current date and time fall between the event's start and end times
                // Consider adding error handling in case eventData.start or eventData.end is invalid.
                if (eventData?.start && eventData?.end && isCurrentDateTimeBetween(eventData.start, eventData.end)) {
                    // If the current time is within the event's active range, enable dependent queries or actions
                    setSkipping(true);
                } else {
                    // If the event is outside the active range, navigate to the '/events' page
                    navigate('/events');
                }
            }
        }
        // Dependencies: Re-run this effect whenever 'eventData' or 'isLoadingEvent' changes
    }, [eventData, isLoadingEvent]);



    // Dynamically determine whether the search input should update the boid (likely a numeric ID filter) or name (a text filter).
    useEffect(() => {
        // Check if the 'search' string contains any numbers
        if (containsNumber(search)) {
            // If it does, set the 'boid' state with the search value and clear the 'name' state
            setBoid(search);
            setName('');
        } else {
            // If it doesn't, set the 'name' state with the search value and clear the 'boid' state
            setBoid('');
            setName(search);
        }

        // The 'skipping' state could be set here to trigger dependent queries, but it is commented out
        setSkipping(true);
    }, [search, name, boid, page]); // Dependencies: Re-run whenever 'search', 'name', 'boid', or 'page' changes.


    // Use a regular expression to test for the presence of at least one digit in the string
    function containsNumber(str) {
        return /\d/.test(str);
    }


    // Used as the actual search function triggered after the debounce delay.
    const doSearch = (value) => {
        setSearch(value); // Updates the 'search' state with the provided value
    };

    // This is a utility function that delays the execution of another function (fn) until after a specified delay (delay) has passed
    const debounce = (fn, delay) => {
        let timeoutId; // Stores the timeout ID for clearing
        return (...args) => { // Returns a new debounced function
            clearTimeout(timeoutId); // Clears any previous timeout to reset the delay
            timeoutId = setTimeout(() => {
                fn(...args); // Calls the function with the latest arguments after the delay
            }, delay);
        };
    };

    // Prevents excessive state updates or API calls by ensuring the doSearch function is only executed after the user stops typing for 1 second.
    const handleSearch = debounce(doSearch, 1000) // A debounced version of doSearch with a 1-second delay


    const handleClear = () => {
        inputRef.current.value = ''; // Clears the value in the input field
        setSearch('');               // Resets the 'search' state to an empty string
    };



    let content = null
    if (isLoading || isLoading2) {
        content = <Loading />
    }
    else if (!isLoading && isError) {
        content = <Error />
    }
    else if (!isLoading && !isError && data?.length === 0) {
        content = <Error message='No Share Holders Found...' />

    }
    else if (!isLoading && !isError && data?.length > 0 && presentList) {

        // Modify data as needed by combining firstData and secondData
        const combinedData = data.map(item => {
            const additionalInfo = presentList.find(p => p.boid === item.boid);
            return {
                ...item,
                present: additionalInfo ? additionalInfo.present : null,
            };
        });

        content = <div className="overflow-x-auto">
            <table className="table table-xs">
                <thead className='text-xl bg-slate-500 text-white shadow-xl'>
                    <tr>
                        <th></th>
                        <th className='py-3'>BOID</th>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Signature</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        combinedData
                            // .filter(d => {
                            //     if (d.boid.includes(search) || d.name.toLowerCase().includes(search.trim().toLowerCase())) {
                            //         return true;
                            //     } else {
                            //         return false;
                            //     }
                            // })
                            .map((item, index) => <AttendanceTableRow
                                key={index}
                                item={item}
                                index={index}
                                eventId={eventId}
                                eventStart={eventData?.start}
                                eventEnd={eventData?.end}
                            />)
                    }
                </tbody>
            </table>
        </div>
    }


    return (
        <div className='p-5'>
            {/* Button */}
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>Attendance</h1>
                <div className='flex items-center gap-3'>
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search"
                            onChange={(e) => handleSearch(e.target.value)}
                            ref={inputRef}
                        />
                        {search && <IoMdClose onClick={handleClear} />}
                    </label>
                    <button className="btn btn-primary" onClick={() => navigate(`/present/${eventId}`)}>
                        Present List
                        <FaList />
                    </button>
                </div>
            </div>

            <div className="divider">Share Holders</div>

            {/* Table */}
            {content}

            {/* Pagination */}
            {!isLoading && !isLoading2 && <div className='bg-slate-500 flex justify-center'>
                <div className="join m-2 gap-1 text-center">
                    {
                        page > 1 && <button className="join-item btn"><MdNavigateBefore size={30} onClick={() => setPage((prev => prev - 1))} /></button>
                    }
                    <button className="join-item btn">Page {page}</button>
                    {
                        data?.length > 0 && <button className="join-item btn"><MdNavigateNext size={30} onClick={() => setPage((prev => prev + 1))} /></button>
                    }
                </div>
            </div>}
        </div>
    )
}

export default Attendance