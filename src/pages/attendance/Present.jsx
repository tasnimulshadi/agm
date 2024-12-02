import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaDownload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import PresentTableRow from '../../components/attendance/PresentTableRow';
import { useGetAllPresentListQuery } from '../../redux/features/attendance/attendanceApi';
import Loading from "../../components/ui/loading/Loading"
import Error from "../../components/ui/error/Error"
import { FaPlus } from "react-icons/fa";
import isCurrentDateTimeBetween from '../../utils/isCurrentDateTimeBetween';
import { useGetSingleEventQuery } from '../../redux/features/event/eventApi';
import { pdf } from '@react-pdf/renderer';
import PresentPdf from '../../components/pdf/PresentPdf';


function Present() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null); // Create a reference to an input element using the useRef hook
    const [search, setSearch] = useState(''); // State for search input, starts with an empty string


    // Fetch the data for a single event based on 'eventId'
    const {
        data: eventData,        // The event data fetched from the query
        isLoading: isLoadingEvent, // Boolean indicating if the query is still loading
        isError: isErrorEvent   // Boolean indicating if an error occurred during the query
    } = useGetSingleEventQuery(eventId);

    const { data, isError, isLoading } = useGetAllPresentListQuery(eventData?.id);


    const handleDownload = async (e) => {
        e.preventDefault();

        // Generate a PDF blob from the document
        const blob = await pdf(<PresentPdf eventData={eventData} data={data.filter(item => item.present)} />).toBlob();

        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'agm_attendance.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = () => {
        inputRef.current.value = ''; // Clears the value in the input field
        setSearch('');               // Resets the 'search' state to an empty string
    };

    // console.log({ eventData, data });


    let content = null
    if (isLoading) {
        content = <Loading />
    }
    else if (!isLoading && isError) {
        content = <Error />
    }
    else if (!isLoading && !isError && data?.length === 0) {
        content = <Error message='No Attendance Data Found...' />

    }
    else if (!isLoading && !isError && data?.length > 0) {

        content = <div className="overflow-x-auto">
            <table className="table table-xs">
                <thead className='text-xl bg-slate-500 text-white shadow-xl'>
                    <tr>
                        <th></th>
                        <th className='py-3'>BOID</th>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Signature</th>
                        <th>Time</th>
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data
                            .filter(item => {
                                // Check if the current date and time fall between the event's start and end times
                                if (isCurrentDateTimeBetween(eventData.start, eventData.end)) {
                                    // If the current time is within the event range, include all elements in the filtered array
                                    return item;
                                } else {
                                    // If the current time is outside the event range, only include elements where 'd.present' is true
                                    return item.present;
                                }
                            })
                            .filter(item => {
                                // This function filters an array based on a search term
                                // Checking for the search term in either name or boid (case-insensitive).
                                if (item.name.toLowerCase().includes(search.toLowerCase()) || item.boid.toLowerCase().includes(search.toLowerCase())) {
                                    return item
                                }
                            })
                            .map((item, index) => <PresentTableRow
                                key={index}
                                index={index}
                                item={item}
                                eventStart={eventData.start}
                                eventEnd={eventData.end}
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
                <div className='flex items-center gap-5'>
                    <h1 className='text-3xl font-bold'>Present List</h1>
                    <button
                        className="btn btn-square btn-warning"
                        onClick={handleDownload}
                        disabled={!data?.length > 0}
                    >
                        <FaDownload />
                    </button>
                </div>
                <div className='flex items-center gap-3'>
                    {/* Search */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                            ref={inputRef}
                        />
                        {search && <IoMdClose onClick={handleClear} />}
                    </label>

                    {/* Attendance */}
                    {isCurrentDateTimeBetween(eventData?.start, eventData?.end) && <button className="btn btn-primary" onClick={() => navigate(`/attendance/${eventId}`)}>
                        Attendance
                        <FaPlus />
                    </button>}
                </div>
            </div>
            <div className="divider">Attendance</div>

            {/* Table */}
            {content}
        </div>
    )
}

export default Present