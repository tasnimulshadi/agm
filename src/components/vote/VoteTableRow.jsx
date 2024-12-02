import { useEffect, useState } from 'react'
import { useUpdateVoteMutation } from '../../redux/features/vote/voteApi';
import isCurrentDateTimeBetween from '../../utils/isCurrentDateTimeBetween'
import moment from 'moment';
import numberWithCommas from "../../utils/numberWithCommas"
import { useSelector } from 'react-redux';

function VoteTableRow({ index, item, eventStart, eventEnd }) {
  const { user } = useSelector(state => state.auth)
  const [showModal, setShowModal] = useState(false);
  const { id, boid, name, unit, signature, vote, voteTime } = item;

  const [updateVote, { isSuccess, isLoading, isUninitialized }] = useUpdateVoteMutation();

  useEffect(() => {
    // Check if the operation (e.g., API call or action) was successful
    if (isSuccess) {
      // If successful, close the modal by setting 'setShowModal' to false
      setShowModal(false);
    }
    // Dependencies: Re-run the effect whenever 'isSuccess' changes
  }, [isSuccess]);


  function handleVote(e, vote) {
    // Prevent the default form submission or other default browser behavior
    e.preventDefault();

    // Check if the current date and time fall within the event's start and end time
    if (isCurrentDateTimeBetween(eventStart, eventEnd)) {
      // If the current time is within the event's active period, update the vote
      updateVote({
        id, // The unique ID for the vote or event
        data: {
          vote, // The vote value being submitted (e.g., "yes" or "no")
          voteTime: new Date().getTime()
        }
      });
    } else {
      // If the current time is outside the event's active period, close the modal
      setShowModal(false);
    }
  }



  return (
    <tr className={index % 2 === 0 ? 'bg-orange-50' : 'bg-cyan-50'}>
      <td className='p-3 text-xl font-semibold'>{index + 1}</td>
      <td className='p-3 text-xl font-semibold tracking-widest'>{boid}</td>
      <td className='p-3 text-xl font-semibold'>{name}</td>
      <td className='p-3 text-xl font-semibold'>{numberWithCommas(Number(unit))}</td>
      <td>
        <img
          src={`/assets/signature/${signature}`}
          alt="Signature Not Found!"
          className='h-20'
        />
      </td>
      <td className='p-3 text-xl font-semibold'>{voteTime ? moment(voteTime).format('LT') : null}</td>
      <td>
        {
          vote === ''
            ? isCurrentDateTimeBetween(eventStart, eventEnd) && user?.level < 3
              ? <button
                className="btn btn-warning"
                onClick={() => setShowModal(true)}
                disabled={!isUninitialized}
              >Vote
              </button>
              : null
            : vote === 'yes'
              ? <button className="btn btn-success text-white cursor-default">Yes</button>
              : <button className="btn btn-error text-white cursor-default">No</button>
        }


        <dialog className="modal" open={showModal}>
          {/* modal card */}
          <div className=" modal-box card card-compact bg-base-100 max-w-4xl shadow-xl p-0">
            <figure>
              <img
                src={`/assets/signature/${signature}`}
                alt="Signature Not Found!"
                className='w-[1000px]'
              />
            </figure>
            <div className="card-body">
              <div className='flex justify-between'>
                <h1 className='text-xl'>Bo Id: <span className="text-4xl tracking-widest font-bold">{boid}</span></h1>
                <h1 className='text-xl'>Unit: <span className="text-3xl font-bold">{numberWithCommas(Number(unit))}</span></h1>
              </div>
              <h1 className='text-xl'>Name: <span className="text-2xl font-bold">{name}</span></h1>

              <div className="divider m-0">Vote</div>
              <div className="card-actions justify-between">
                {/* Yes */}
                <button
                  className="btn btn-success text-white btn-lg btn-wide"
                  onClick={(e) => handleVote(e, 'yes')}
                  disabled={isLoading}
                >
                  Yes
                  {isLoading && <span className="loading loading-spinner"></span>}
                </button>

                {/* No */}
                <button
                  className="btn btn-error text-white btn-lg btn-wide"
                  onClick={(e) => handleVote(e, 'no')}
                  disabled={isLoading}
                >
                  No
                  {isLoading && <span className="loading loading-spinner"></span>}
                </button>
              </div>
            </div>
          </div>

          {/* modal close */}
          <form method="dialog" className="modal-backdrop bg-[#000000ac]" >
            <button onClick={() => setShowModal(false)} className=' cursor-default'>close</button>
          </form>
        </dialog>
      </td>
    </tr>
  )
}

export default VoteTableRow