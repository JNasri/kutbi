import type { ComponentProps } from 'react';
import { useAdmin } from './AdminLayout';

export default function AdminForm(props: ComponentProps<'form'>) {
  const { t } = useAdmin();
  return <form {...props} onInvalidCapture={(event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      const message = field.validity.valueMissing ? 'Please complete this field.' : field.validity.tooShort ? 'Please enter a longer value.' : field.validity.customError ? field.validationMessage : 'Please enter a valid value.';
      field.setCustomValidity(t(message));
    }
    props.onInvalidCapture?.(event);
  }} onInputCapture={(event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) field.setCustomValidity('');
    props.onInputCapture?.(event);
  }} />;
}
