import { useEffect, useState } from 'react'
import moment from 'moment';
import { useUpdateAttendanceMutation } from '../../redux/features/attendance/attendanceApi';
import isCurrentDateTimeBetween from '../../utils/isCurrentDateTimeBetween'
import numberWithCommas from "../../utils/numberWithCommas"
import { useSelector } from 'react-redux';

function PresentTableRow({ index, item, eventStart, eventEnd }) {
  const { user } = useSelector(state => state.auth)
  const [showModal, setShowModal] = useState(false);
  const { id, boid, name, unit, time1, time2, signature, present } = item;

  const [updateAttendance, { isSuccess, isLoading, isUninitialized }] = useUpdateAttendanceMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false)
    }
  }, [isSuccess])

  function handleApprove(e) {
    e.preventDefault();

    if (isCurrentDateTimeBetween(eventStart, eventEnd)) {
      updateAttendance({
        id,
        data: {
          present: true,
          time2: new Date().getTime()
        }
      });
    }
    else {
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
      <td className='p-3 text-xl font-semibold'>{moment(present ? time2 : time1).format('LT')}</td>
      <td>
        {
          present
            ? <button className="btn btn-success text-white cursor-default">Present</button>
            : user?.level < 3
              ? <button
                className="btn btn-warning"
                onClick={() => setShowModal(true)}
                disabled={!isUninitialized}
              >
                Approve</button>
              : <button className="btn btn-warning" disabled>Waiting For Approval</button>

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
              <h1 className='text-xl'>Time1: {moment(time1).format('LT')}</h1>

              <div className="divider m-0">Mark Present</div>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-warning"
                  onClick={handleApprove}
                  disabled={isLoading}
                >
                  Mark Present
                  {isLoading && <span className="loading loading-spinner"></span>}
                </button>
              </div>
            </div>
          </div>

          {/* modal close */}
          <form method="dialog" className="modal-backdrop bg-[#000000ac] " >
            <button onClick={() => setShowModal(false)} className=' cursor-default'>close</button>
          </form>
        </dialog>
      </td>
    </tr >
  )
}

export default PresentTableRow