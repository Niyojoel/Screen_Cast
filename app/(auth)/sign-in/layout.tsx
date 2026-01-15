
import {Toaster} from 'react-hot-toast'

export default function Layout({
  children,
}: {children: React.ReactNode}) {
  return (
    <div>
      <Toaster/>
      {children}
    </div>
  );
}

