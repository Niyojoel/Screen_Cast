
import { Modal } from '@/components';
import Navbar from '@/components/Navbar';
import {Toaster} from 'react-hot-toast'
import { useGlobalContext } from '@/lib/hooks/useGlobalContext';
import { DIALOG_ICONS } from '@/constants/lists';

export default function Layout({
  children,
}: {children: React.ReactNode}) {
  const {modal, modalError, closeModal, showModalError} = useGlobalContext();

  return (
      <div>
        <Navbar/>
        <Toaster/>
        {children}
        {modal.state && <Modal
          closeModal={closeModal}
          closeIcon = {modal.closeIcon || DIALOG_ICONS.close}
          contentBody= {modal.content}
          footerButtons= {modal.buttons}
          error={modalError}
          setError={showModalError}
        />}
      </div>
  );
}

