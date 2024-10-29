import { Link } from 'react-router-dom';
import ButtonPrimary from '../components/button-primary';

function App() {
  return (
    <div className="flex items-center	justify-center flex-col gap-4 min-h-[100vh]">
        <img src={`https://cdn.streamelements.com/infinity/summoners/logo_lost_centuria.png`} className="max-w-[50vh] h-auto" alt="logo" />
        <h1 className='cinzel text-4xl'>
          Welcome to the Lost Centuria Rune Builder!
        </h1>

        <Link to={'build/new'}>
          <ButtonPrimary>
            Create new!
          </ButtonPrimary>
        </Link>
    </div>
  );
}

export default App;
