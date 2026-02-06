
import { Modal} from '@/components';
import Navbar from '@/components/Navbar';
import {Toaster} from 'react-hot-toast'

export default function Layout({
  children,
}: {children: React.ReactNode}) {

  return (
    <div>
      <Navbar/>
      <Toaster/>
      {children}
      <Modal/>
    </div>
  );
}

