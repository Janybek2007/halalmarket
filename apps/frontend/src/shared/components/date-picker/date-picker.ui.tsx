'use client';

import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';

import { Assets } from '~/shared/assets';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { Calendar } from '../calendar/calendar.ui';
import type { DatePickerProps } from './date-picker.types';
import styles from './styles.module.scss';

const PLACEHOLDER = 'дд.мм.гггг';

const formatToDisplay = (dateValue: string | null | undefined): string => {
	if (!dateValue) return PLACEHOLDER;
	const [year, month, day] = dateValue.split('-');
	return `${day}.${month}.${year}`;
};

export const DatePicker: React.FC<DatePickerProps> = React.memo(
	({ startDate, endDate, className }) => {
		const [open, setOpen] = useState<'start' | 'end' | null>(null);

		const toggleStartCalendar = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
			setOpen('start');
		}, []);

		const toggleEndCalendar = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
			setOpen('end');
		}, []);

		const formattedStartDate = formatToDisplay(startDate.value);
		const formattedEndDate = formatToDisplay(endDate.value);

		const calendarProps = useMemo(
			() => ({
				selectedDate: startDate.value,
				onSelectDate: (date: string) => startDate.setValue(date),
				otherDate: endDate.value,
				isStartDate: true,
			}),
			[startDate.value, endDate.value, startDate.setValue]
		);

		const endCalendarProps = useMemo(
			() => ({
				selectedDate: endDate.value,
				onSelectDate: (date: string) => endDate.setValue(date),
				otherDate: startDate.value,
				isStartDate: false,
			}),
			[endDate.value, startDate.value, endDate.setValue]
		);

		return (
			<div className={clsx(styles.container, className)}>
				<div className={styles.dateRangeContainer}>
					<div className={styles.dateRangeSelector}>
						<button
							type='button'
							className={styles.datePicker}
							onClick={toggleStartCalendar}
							aria-label='Выбрать дату начала'
						>
							<span className={styles.dateText}>{formattedStartDate}</span>
							<span className={styles.calendarButton} aria-hidden='true'>
								<img src={Assets.CalendarSvg} alt='Календарь' />
							</span>
						</button>

						<div className={styles.arrowButton}>
							<Icon name='line-md:arrow-right' />
						</div>

						<button
							type='button'
							className={styles.datePicker}
							onClick={toggleEndCalendar}
							aria-label='Выбрать дату окончания'
						>
							<span className={styles.dateText}>{formattedEndDate}</span>
							<span className={styles.calendarButton}>
								<img src={Assets.CalendarSvg} alt='Календарь' />
							</span>
						</button>
					</div>

					{open === 'start' && (
						<div className={`${styles.calendarDropdown} ${styles.left}`}>
							<Calendar {...calendarProps} onClose={() => setOpen(null)} />
						</div>
					)}

					{open === 'end' && (
						<div className={`${styles.calendarDropdown} ${styles.right}`}>
							<Calendar {...endCalendarProps} onClose={() => setOpen(null)} />
						</div>
					)}
				</div>
			</div>
		);
	}
);

DatePicker.displayName = '_DatePicker_';
