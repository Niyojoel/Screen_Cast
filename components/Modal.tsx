'use client'
import { useModalContext } from '@/lib/hooks/useModalContext';
import {
  ActionButton, 
  FullView, 
  Logo
} from '.';
import { cn } from '@/lib/utils';

const Modal = () => {
    
  const {
    modalOpen, 
    modalContent, 
    exitModal, 
    closeModal
  } = useModalContext();

  const {
    closeIcon, 
    isOpen
  } = modalOpen

  return (
    <main className={cn("modal", isOpen && modalContent.body ? 'visible z-40 opacity-100 pointer-events-auto' : 'z-0 invisible opacity-0 pointer-events-none select-none')}>
      <FullView/>
      <div className="modal-overlay" onClick={closeModal}/>
      <section className='modal-content'>
        <div className="dialog-box">
          <div className="header-constraint">
            <div className='header-bg'/>
          </div>
          <figure className='dialog-header'>
              <Logo inactive />
              <button className='modal-home-btn' onClick={exitModal}>
                {closeIcon}
              </button>
          </figure>
          <article className='dialog-content'>
            <section>
                {modalContent?.body}
            </section>
            {modalContent?.buttons && modalContent?.buttons.length > 0 && (<div className="dialog-btns">
              {modalContent?.buttons.map(btn => (
                <ActionButton
                  key={btn.text}
                  action={btn.action}
                  className= {btn.className}
                  text = {btn.text}
                >
                  {btn?.icon && btn.icon}
                </ActionButton>
              )
              )}
            </div>)}
          </article>
        </div>
      </section>
    </main>
  )
}

export default Modal