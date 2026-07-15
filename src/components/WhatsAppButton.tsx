import { whatsappNumber } from './TripPlanner';

export default function WhatsAppButton({ label }: { label: string }) {
  return <a className="whatsapp-button" href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#trip-planner'} target={whatsappNumber ? '_blank' : undefined} rel={whatsappNumber ? 'noopener noreferrer' : undefined} aria-label={label} title={label}>
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path className="whatsapp-ring" d="M16 4.2A11.7 11.7 0 0 0 5.9 21.8L4.4 27.6l5.9-1.55A11.7 11.7 0 1 0 16 4.2Z" />
      <path className="whatsapp-phone" d="M12.05 9.75c-.27-.65-.55-.67-.82-.68h-.7c-.25 0-.65.1-.99.48-.34.38-1.3 1.27-1.3 3.1 0 1.82 1.33 3.58 1.52 3.83.18.25 2.6 4.16 6.46 5.67 3.2 1.26 3.86 1.01 4.55.95.7-.06 2.25-.92 2.57-1.81.32-.9.32-1.66.23-1.82-.1-.16-.36-.25-.75-.44l-2.64-1.24c-.39-.19-.68-.28-.97.16l-1.16 1.43c-.24.29-.49.33-.9.12-.4-.2-1.72-.63-3.28-2.02-1.21-1.08-2.03-2.42-2.27-2.83-.23-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.24.27-.41.4-.68.14-.26.07-.5-.03-.7l-.9-2.2Z" />
    </svg>
  </a>;
}
