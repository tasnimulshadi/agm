import { useEffect, useState } from 'react'
import img from './123456789.png'
import { useAddToAttendanceMutation } from '../../redux/features/attendance/attendanceApi';
import isCurrentDateTimeBetween from '../../utils/isCurrentDateTimeBetween'
import numberWithCommas from "../../utils/numberWithCommas"

function AttendanceTableRow({ index, item, eventId, eventStart, eventEnd }) {
  const [showModal, setShowModal] = useState(false);
  const { boid, name, unit, signature, present } = item;

  const [addToAttendance, { isSuccess, isLoading, isUninitialized }] = useAddToAttendanceMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false)
    }
  }, [isSuccess])

  function handlePresent(e) {
    e.preventDefault();

    if (isCurrentDateTimeBetween(eventStart, eventEnd)) {
      addToAttendance({
        boid,
        eventId,
        name,
        unit,
        signature,
        present: false,
        time1: new Date().getTime(),
        time2: null,
        voteTime: null,
        vote: ""
      })
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
      <td>
        {
          present === null
            ? <button
              className="btn btn-primary font-bold"
              onClick={() => setShowModal(true)}
              disabled={!isUninitialized}
            >
              Mark Attendance
            </button>
            : present === true
              ? <button className="btn btn-success text-white cursor-default">Present</button>
              : <button className="btn btn-warning cursor-default">Processing</button>
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

              <div className="divider m-0">Mark Present</div>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary btn-lg btn-wide"
                  onClick={handlePresent}
                  disabled={isLoading}
                >
                  Present
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

export default AttendanceTableRow