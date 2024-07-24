import { useEffect } from 'react';
import './Status.scss';
import axios from 'axios';


function Status() {
  const statusURL = process.env.REACT_APP_STATUS ? process.env.REACT_APP_STATUS : 'no env variable';

  // Get status page information on mount
  useEffect(() => {
    axios.get(statusURL).then(res => {
      console.log('res', res);
    })
  }, []);

  return (
      <div>
        <h1>Status-sivu</h1>
      </div>
  )
}

export default Status;
