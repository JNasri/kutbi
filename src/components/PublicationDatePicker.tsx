import { useEffect, useRef, useState, type ReactNode } from 'react';
import { isValid, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import { arSA } from 'date-fns/locale/ar-SA';
import { enGB } from 'date-fns/locale/en-GB';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAdmin } from './AdminLayout';
import 'react-datepicker/dist/react-datepicker.css';

function LocalizedCalendar({ className, children }: { className?: string; children?: ReactNode }) {
  const { t } = useAdmin();
  return <div className={className} role="dialog" aria-modal="true" aria-label={t('Choose publication date')}>{children}</div>;
}

function LocalizedTimeInput({ value = '', onChange }: { value?: string; onChange?: (value: string) => void }) {
  const { language, t } = useAdmin();
  return <input type="time" lang={language} aria-label={t('Time')} value={value} onChange={(event) => onChange?.(event.target.value)} />;
}

export default function PublicationDatePicker({ value, onChange, required, disabled }: { value?: string | null; onChange: (value: string | null) => void; required: boolean; disabled: boolean }) {
  const { language, t } = useAdmin();
  const picker = useRef<DatePicker>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const selected = value && !Number.isNaN(new Date(value).getTime()) ? new Date(value) : null;
  const timezone = new Intl.DateTimeFormat(language, { timeZoneName: 'long' }).formatToParts(selected ?? new Date()).find((part) => part.type === 'timeZoneName')?.value ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = language === 'ar' ? arSA : enGB;

  return (
    <div className="publication-date editor-span-two">
      <label htmlFor="publication-date">{t('Publication date')}</label>
      <DatePicker ref={picker} id="publication-date" selected={selected} onChange={(date: Date | null) => onChange(date ? date.toISOString() : null)}
        locale={locale} dateFormat="dd MMM yyyy, HH:mm" showTimeInput timeInputLabel={t('Time')} customTimeInput={<LocalizedTimeInput />}
        chooseDayAriaLabelPrefix={t('Choose')} disabledDayAriaLabelPrefix={t('Not available')}
        monthAriaLabelPrefix={t('Month')} weekAriaLabelPrefix={t('Calendar')} ariaLabelClose={t('Close calendar')}
        onChangeRaw={(event) => {
          if (event?.target instanceof HTMLInputElement) {
            const input = event.target;
            const valid = !input.value || isValid(parse(input.value, 'dd MMM yyyy, HH:mm', new Date(), { locale }));
            input.setCustomValidity(valid ? '' : t('Choose a valid publication date.'));
          }
        }}
        onSelect={() => { if (picker.current?.input instanceof HTMLInputElement) picker.current.input.setCustomValidity(''); }}
        showIcon icon={<FiCalendar aria-hidden="true" />} toggleCalendarOnIconClick showPopperArrow={false} popperPlacement="bottom-start"
        calendarClassName="studio-calendar" calendarContainer={LocalizedCalendar} withPortal={mobile} required={required} disabled={disabled} autoComplete="off" strictParsing
        placeholderText={t('Choose publication date')} shouldCloseOnSelect={false}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth, changeMonth, changeYear }) => (
          <div className="studio-calendar-header" dir="ltr">
            <button type="button" onClick={decreaseMonth} aria-label={t('Previous month')}><FiChevronLeft /></button>
            <select aria-label={t('Month')} value={date.getMonth()} onChange={(event) => changeMonth(Number(event.target.value))}>
              {Array.from({ length: 12 }, (_, month) => <option key={month} value={month}>{new Intl.DateTimeFormat(language, { month: 'long' }).format(new Date(2026, month, 1))}</option>)}
            </select>
            <select aria-label={t('Year')} value={date.getFullYear()} onChange={(event) => changeYear(Number(event.target.value))}>
              {Array.from({ length: 41 }, (_, index) => date.getFullYear() - 20 + index).map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <button type="button" onClick={increaseMonth} aria-label={t('Next month')}><FiChevronRight /></button>
          </div>
        )}>
        <div className="studio-calendar-footer"><button type="button" onClick={() => onChange(new Date().toISOString())}>{t('Today')}</button><button type="button" onClick={() => picker.current?.setOpen(false)}>{t('Done')}</button></div>
      </DatePicker>
      <small>{t('Times use your device timezone:')} <bdi>{timezone}</bdi></small>
      <span className="sr-only" role="status" aria-live="polite">{t('Selected publication date')}: {selected ? new Intl.DateTimeFormat(language, { dateStyle: 'full', timeStyle: 'short' }).format(selected) : t('No date selected')}</span>
    </div>
  );
}
