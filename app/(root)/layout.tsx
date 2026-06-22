
import { Modal } from '@/components';
import Navbar from '@/components/Navbar';
import {Toaster} from 'react-hot-toast'

export default function Layout({
  children,
  modal
}: {children: React.ReactNode, modal: React.ReactNode}) {

  return (
    <div>
      <Navbar/>
      <Toaster/>
      {children}
      {modal}
      <Modal/>
    </div>
  );
}

