import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaDownload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import VoteTableRow from '../../components/vote/VoteTableRow';
import { useGetAllVotersQuery } from '../../redux/features/vote/voteApi';
import Loading from "../../components/ui/loading/Loading"
import Error from "../../components/ui/error/Error"
import { useGetSingleEventQuery } from '../../redux/features/event/eventApi';
import VotePdf from '../../components/pdf/VotePdf';
import { pdf } from '@react-pdf/renderer';
import numberWithCommas from "../../utils/numberWithCommas"

function Vote() {
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

    const { data, isError, isLoading } = useGetAllVotersQuery(eventData?.id);

    async function handleDownload(e) {
        e.preventDefault();

        // Generate a PDF blob from the document
        const blob = await pdf(<VotePdf eventData={eventData} data={data} />).toBlob();

        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'agm_vote.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function calculatePercentage(part, whole) {
        const res = (part / whole) * 100
        return res.toFixed(2);
    }

    const handleClear = () => {
        inputRef.current.value = ''; // Clears the value in the input field
        setSearch('');               // Resets the 'search' state to an empty string
    };


    let content = null
    if (isLoading) {
        content = <Loading />
    }
    else if (!isLoading && isError) {
        content = <Error />
    }
    else if (!isLoading && !isError && data?.length === 0) {
        content = <Error message='No Votes Found...' />

    }
    else if (!isLoading && !isError && data?.length > 0 && eventData?.id) {
        // Calculate the total number of voters (length of the data array)
        const total_voter = data.length;
        const total_voted = data.reduce((accumulator, current) => accumulator + (current.vote !== '' ? 1 : 0), 0);
        // Calculate the total units voted by all voters (sum of 'unit' property for each entry)
        const total_voter_unit = data.reduce((accumulator, current) => accumulator + Number(current.unit), 0);

        // Calculate the number of 'yes' votes
        const yes_vote = data.reduce((accumulator, current) => accumulator + (current.vote === 'yes' ? 1 : 0), 0);
        // Calculate the percentage of 'yes' votes
        const yes_vote_percentage = calculatePercentage(yes_vote, total_voter);
        // Calculate the total units associated with 'yes' votes
        const yes_vote_unit = data.reduce((accumulator, current) => accumulator + (current.vote === 'yes' ? Number(current.unit) : 0), 0);
        // Calculate the percentage of total units contributed by 'yes' votes
        const yes_vote_unit_percentage = calculatePercentage(yes_vote_unit, total_voter_unit);

        // Calculate the number of 'no' votes
        const no_vote = data.reduce((accumulator, current) => accumulator + (current.vote === 'no' ? 1 : 0), 0);
        // Calculate the percentage of 'no' votes
        const no_vote_percentage = calculatePercentage(no_vote, total_voter);
        // Calculate the total units associated with 'no' votes
        const no_vote_unit = data.reduce((accumulator, current) => accumulator + (current.vote === 'no' ? Number(current.unit) : 0), 0);
        // Calculate the percentage of total units contributed by 'no' votes
        const no_vote_unit_percentage = calculatePercentage(no_vote_unit, total_voter_unit);


        // console.log({ total_voter, total_voter_unit, yes_vote, yes_vote_unit, no_vote, no_vote_unit });

        content = <div className='p-5'>
            {/* Vote */}
            <div>
                {/* total & download */}
                <div className='flex justify-between items-center gap-5 mb-2'>
                    <div>
                        <h1 className='text-xl '>Total Votes: <span className='text-2xl font-bold'>{total_voted} / {total_voter}</span></h1>
                        <h1 className='text-xl '>Total Units: <span className='text-2xl font-bold'>{numberWithCommas(total_voter_unit)}</span></h1>
                    </div>
                    <div className='flex items-center gap-3'>
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
                        <button className="btn btn-square btn-warning" onClick={handleDownload}><FaDownload /></button>
                    </div>
                </div>

                {/* Yes No */}
                <div className='flex justify-between'>
                    {/* Yes */}
                    <div className='bg-green-100 w-full p-5 rounded-l-lg flex justify-between items-center'>
                        <div>
                            <h1 className='text-xl '>Yes Vote: <span className='text-2xl font-bold'>{yes_vote}</span>, ({yes_vote_percentage}%)</h1>
                            <h1 className='text-xl '>Yes Vote Units: <span className='text-2xl font-bold'>{numberWithCommas(yes_vote_unit)}</span>, ({yes_vote_unit_percentage}%)</h1>
                        </div>
                        <span className='text-4xl font-bold text-green-700'><span className='text-6xl'>{yes_vote_unit_percentage}</span>%</span>
                    </div>

                    {/* No */}
                    <div className='bg-red-100 w-full p-5 rounded-r-lg flex justify-between items-center'>
                        <span className='text-4xl font-bold text-red-700'><span className='text-6xl'>{no_vote_unit_percentage}</span>%</span>
                        <div>
                            <h1 className='text-xl text-end'>Yes Vote: <span className='text-2xl font-bold'>{no_vote}</span>, ({no_vote_percentage}%)</h1>
                            <h1 className='text-xl text-end'>Yes Vote Units: <span className='text-2xl font-bold'>{numberWithCommas(no_vote_unit)}</span>, ({no_vote_unit_percentage}%)</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider">Vote</div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead className='text-xl bg-slate-500 text-white shadow-xl'>
                        <tr>
                            <th></th>
                            <th className='py-3'>BOID</th>
                            <th>Name</th>
                            <th>Unit</th>
                            <th>Signature</th>
                            <th>Time</th>
                            <th>Vote Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data
                                .filter(item => {
                                    // This function filters an array based on a search term
                                    // Checking for the search term in either name or boid (case-insensitive).
                                    if (item.name.toLowerCase().includes(search.toLowerCase()) || item.boid.toLowerCase().includes(search.toLowerCase())) {
                                        return item
                                    }
                                })
                                .map((item, index) => <VoteTableRow
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
        </div>
    }


    return content
}

export default Vote