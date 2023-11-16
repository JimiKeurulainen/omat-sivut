import './ErrorPage.scss';
import { useNavigate } from 'react-router-dom';


function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className='ErrorPage'>
      <p>404 - Sivua ei löytynyt :(</p>
      <button onClick={() => navigate(-1)}>Palaa takaisin</button>
    </div>
  )
}

export default ErrorPage;
