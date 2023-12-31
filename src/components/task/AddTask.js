import React from 'react'
import Modal from 'react-modal'
import { useSession } from "next-auth/react"
import { useState, useEffect } from 'react'
Modal.setAppElement('#__next')
import styles from '@/styles/Task.module.css'
import { AiOutlineClose } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';


const notify = () => { const notify = new Notification("Planned IT!") }

export default function AddTask(props) {


  const { data: session, loading } = useSession();
  const email = session?.user?.uid;
  const [Title, setTitle] = useState('');
  const [Duration_Minutes, setDuration_Minutes] = useState('15');
  const [Duration_Hours, setDuration_Hours] = useState('0');
  const [Priority, setPriority] = useState(1);
  let d = new Date()
  if (props.date) {
    d = new Date(props.date)
  }
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  const [Due, setDue] = useState(d.toJSON().slice(0, 10));
  const [Start, setStart] = useState(d.toJSON().slice(0, 10));
  const [Description, setDescription] = useState('');

  const handleSubmit = async () => {
    // console.log(Title, Duration_Minutes, Duration_Hours, (int(Duration_Minutes) + 60 * int(Duration_Hours)) , Due, Start, Description, session.user.email);
    const res = await fetch('/api/task/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Title, Duration_Minutes: parseInt(Duration_Minutes), Duration_Hours: parseInt(Duration_Hours), Duration: parseInt(parseInt(Duration_Minutes) + 60 * parseInt(Duration_Hours)), Due, Start, Description, User: email, Priority, Completed: false, Deleted: false
      }),
    });
    const data = await res.json();
    if (data) {
      setTitle('')
      setDuration_Minutes('15')
      setDuration_Hours('0')
      setDue(d.toJSON().slice(0, 10))
      setStart(d.toJSON().slice(0, 10))
      setDescription('')
      const notify = new Notification(`Task Added: ${Title}`)
      props?.taskadded();

    }
    console.log(data);
    console.log("Sent");
    props.toggleModal()
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    }
    if (id === "estimate_minutes") {
      setDuration_Minutes(value);
    }
    if (id === "estimate_hours") {
      setDuration_Hours(value);
    }
    if (id === "start") {
      setStart(value);
    }
    if (id === "due") {
      console.log(value);
      setDue(value);
    }
    if (id === "description") {
      setDescription(value);
    }
  }
  return (
    <>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={props.toggleModal}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          },
          content: {
            position: 'absolute',
            top: '10%',
            left: '20%',
            right: '20%',
            bottom: '10%',
            border: '2px solid #009b9a',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '12px',
            outline: 'none',
            padding: '20px'
          }
        }}
      >
        <div>
          <Toaster />
          <h1 className={styles.head}>
            <div className='text-center'>
              Add task to <span className={styles.hv}>Tasks</span>
            </div>
            <button className={styles.cl} onClick={props.toggleModal}>
              < Icon icon={<AiOutlineClose size="16" />} />
            </button>
          </h1>
          <Divider></Divider>
          <div className='flex flex-col pt-2'>


            <input id='title' type="text" value={Title} placeholder='Task Title' onChange={(e) => handleInputChange(e)} className={styles.form__inp} />

            <br />

            <div className={styles.time__inp}>

              <div className='w-3/5'>

                <div className='flex justify-between'>
                  <label htmlFor="estimate_minutes" className=''>Minutes</label>
                  <input id='estimate_minutes' type="text" placeholder='mm' value={Duration_Minutes} onChange={(e) => handleInputChange(e)} />
                </div>

                <br />

                <div className="flex justify-between">
                  <label htmlFor="estimate_hours" className=''>Hours</label>
                  <input id='estimate_hours' type="text" placeholder='hh' value={Duration_Hours} onChange={(e) => handleInputChange(e)} />
                </div>

                <br />

                <div className="flex justify-between">
                  <label htmlFor="start" className=''>Start</label>
                  <input id='start' type="date" value={Start} onChange={(e) => handleInputChange(e)} />
                </div>

                <br />

                <div className="flex justify-between">
                  <label htmlFor="due" className=''>Due</label>
                  <input id='due' type="date" value={Due} onChange={(e) => handleInputChange(e)} />
                </div>

                <br />

                <div className="flex justify-between">
                  <label htmlFor="description" className=''>Description</label>
                  <input id='description' type="textarea" value={Description} placeholder='Add Description' onChange={(e) => handleInputChange(e)} />
                </div>
                <br />
              </div>
              <div className='flex'>
                <button type="cancel" onClick={props.toggleModal} className={styles.btn}>Cancel</button>
                <button onClick={() => handleSubmit()} className={styles.btn}>Add</button>
              </div>
            </div>
          </div>
        </div>

      </Modal >

    </>
  )
}

const Icon = ({ icon }) => (
  <div>
    {icon}
  </div>
);

const Divider = () => <hr className={styles.barhr} />;