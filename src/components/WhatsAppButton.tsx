import { whatsappNumber } from './TripPlanner';
import { FaWhatsapp } from 'react-icons/fa';
import { createPortal } from 'react-dom';

export default function WhatsAppButton({ label }: { label: string }) {
  return createPortal(<a className="whatsapp-button" href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#trip-planner'} target={whatsappNumber ? '_blank' : undefined} rel={whatsappNumber ? 'noopener noreferrer' : undefined} aria-label={label} title={label}>
    <FaWhatsapp aria-hidden="true" focusable="false" />
  </a>, document.body);
}
