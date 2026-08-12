import { FaWhatsapp } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { whatsappUrl } from '../contact';

export default function WhatsAppButton({ label }: { label: string }) {
  return createPortal(<a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
    <FaWhatsapp aria-hidden="true" focusable="false" />
  </a>, document.body);
}
