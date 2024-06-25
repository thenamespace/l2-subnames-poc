import { AppRouter } from "./AppRouter";
import { WalletConnect, ThorinDesign } from "./components";
import { ToastContainer } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <WalletConnect>
      <ThorinDesign>
         <AppRouter/>
      </ThorinDesign>
      <ToastContainer/>
    </WalletConnect>
  );
}


export default App;