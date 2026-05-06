import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="tw-min-h-screen tw-bg-gray-50">
          <Navbar />
          <main>
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
