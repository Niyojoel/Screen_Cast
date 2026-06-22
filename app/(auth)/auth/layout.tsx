import {Toaster} from 'react-hot-toast'
import AuthViewProvider from './authViewContext';

export default function Layout({ children }: {children: React.ReactElement}) {
  return (
    <div>
      <Toaster/>
        <AuthViewProvider>
          {children}
        </AuthViewProvider>
      <div className="overlay"/>
    </div>
  );
}

