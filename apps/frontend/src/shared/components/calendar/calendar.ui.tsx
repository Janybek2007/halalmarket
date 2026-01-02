'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useClickAway } from '~/shared/hooks/use-click-away';
import { Icon } from '~/shared/ui/icon/icon.ui';
import type { CalendarProps } from './calendar.types';
import styles from './styles.module.scss';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Парсинг строки 'YYYY-MM-DD' в Date (без parseISO)
const parseToDate = (date?: string | null): Date | null => {
	if (!date) return null;
	const [year, month, day] = date.split('-').map(Number);
	if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
	return new Date(year, month - 1, day);
};

// Форматирование Date → 'YYYY-MM-DD' (без formatDate)
const formatToISO = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// Русское название месяца и год (декабрь 2025)
const formatMonthTitle = (date: Date): string => {
	return new Intl.DateTimeFormat('ru-RU', {
		month: 'long',
		year: 'numeric'
	})
		.format(date)
		.replace(' г.', '');
};

// Добавление/вычитание месяцев вручную
const addMonths = (date: Date, amount: number): Date => {
	const newDate = new Date(date);
	newDate.setMonth(date.getMonth() + amount);
	return newDate;
};

// Сравнения дат
const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
	if (!d1 || !d2) return false;
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
};

const isAfter = (d1: Date | null, d2: Date | null): boolean => {
	if (!d1 || !d2) return false;
	return d1.getTime() > d2.getTime();
};

const isBefore = (d1: Date | null, d2: Date | null): boolean => {
	if (!d1 || !d2) return false;
	return d1.getTime() < d2.getTime();
};

export const Calendar: React.FC<CalendarProps> = React.memo(
	({ selectedDate, onSelectDate, otherDate, isStartDate, onClose }) => {
		const parsedSelectedDate = useMemo(
			() => parseToDate(selectedDate),
			[selectedDate]
		);
		const parsedOtherDate = useMemo(() => parseToDate(otherDate), [otherDate]);

		const [currentMonth, setCurrentMonth] = useState<Date>(
			parsedSelectedDate ?? new Date()
		);
		const [isAnimating, setIsAnimating] = useState(false);
		const [animationDirection, setAnimationDirection] = useState<
			'forward' | 'backward'
		>('forward');

		const containerRef = useClickAway<HTMLDivElement>(onClose);

		useEffect(() => {
			if (parsedSelectedDate) {
				setCurrentMonth(parsedSelectedDate);
			}
		}, [parsedSelectedDate]);

		const goToPreviousMonth = useCallback(() => {
			setIsAnimating(true);
			setAnimationDirection('backward');
			setTimeout(() => {
				setCurrentMonth(prev => addMonths(prev, -1));
				setTimeout(() => setIsAnimating(false), 50);
			}, 150);
		}, []);

		const goToNextMonth = useCallback(() => {
			setIsAnimating(true);
			setAnimationDirection('forward');
			setTimeout(() => {
				setCurrentMonth(prev => addMonths(prev, 1));
				setTimeout(() => setIsAnimating(false), 50);
			}, 150);
		}, []);

		const handleDateClick = useCallback(
			(date: Date) => {
				if (isStartDate && parsedOtherDate && isAfter(date, parsedOtherDate))
					return;
				if (!isStartDate && parsedOtherDate && isBefore(date, parsedOtherDate))
					return;
				onSelectDate(formatToISO(date));
			},
			[isStartDate, parsedOtherDate, onSelectDate]
		);

		const generateCalendarDays = useMemo(() => {
			const year = currentMonth.getFullYear();
			const month = currentMonth.getMonth();

			const firstDayOfMonth = new Date(year, month, 1);
			const lastDayOfMonth = new Date(year, month + 1, 0);

			let startWeekday = firstDayOfMonth.getDay();
			if (startWeekday === 0) startWeekday = 6;
			else startWeekday -= 1;

			const prevMonthLastDay = new Date(year, month, 0).getDate();
			const paddingStartDays = Array.from({ length: startWeekday }, (_, i) => {
				const day = prevMonthLastDay - startWeekday + i + 1;
				return new Date(year, month - 1, day);
			});

			const daysInMonth = Array.from(
				{ length: lastDayOfMonth.getDate() },
				(_, i) => {
					return new Date(year, month, i + 1);
				}
			);

			const endWeekday = lastDayOfMonth.getDay();
			let endPadding = endWeekday === 0 ? 0 : 7 - endWeekday;
			const paddingEndDays = Array.from({ length: endPadding }, (_, i) => {
				return new Date(year, month + 1, i + 1);
			});

			return [...paddingStartDays, ...daysInMonth, ...paddingEndDays];
		}, [currentMonth]);

		const isCurrentMonthDay = useCallback(
			(date: Date) => date.getMonth() === currentMonth.getMonth(),
			[currentMonth]
		);

		const isDisabled = useCallback(
			(date: Date) => {
				if (!parsedOtherDate) return false;
				return isStartDate
					? isAfter(date, parsedOtherDate)
					: isBefore(date, parsedOtherDate);
			},
			[parsedOtherDate, isStartDate]
		);

		const isInRange = useCallback(
			(date: Date) => {
				if (!parsedSelectedDate || !parsedOtherDate) return false;
				const start = isStartDate ? parsedSelectedDate : parsedOtherDate;
				const end = isStartDate ? parsedOtherDate : parsedSelectedDate;
				return start && end && !isBefore(date, start) && !isAfter(date, end);
			},
			[parsedSelectedDate, parsedOtherDate, isStartDate]
		);

		return (
			<div ref={containerRef} className={styles.calendarContainer}>
				<div className={styles.calendarHeader}>
					<button
						className={styles.monthNavButton}
						onClick={goToPreviousMonth}
						disabled={isAnimating}
					>
						<Icon name='line-md:chevron-left' />
					</button>
					<div
						className={`${styles.monthTitle} ${
							isAnimating ? styles.animating : ''
						}`}
					>
						{formatMonthTitle(currentMonth)}
					</div>
					<button
						className={styles.monthNavButton}
						onClick={goToNextMonth}
						disabled={isAnimating}
					>
						<Icon name='line-md:chevron-right' />
					</button>
				</div>

				<div
					className={`${styles.weekdaysHeader} ${
						isAnimating ? styles.fadeOut : ''
					}`}
				>
					{WEEKDAYS.map(day => (
						<div key={day} className={styles.weekday}>
							{day}
						</div>
					))}
				</div>

				<div
					className={`${styles.calendarGrid} ${
						isAnimating
							? animationDirection === 'forward'
								? styles.slideForward
								: styles.slideBackward
							: ''
					}`}
				>
					{generateCalendarDays.map((day, index) => {
						const selected = isSameDay(day, parsedSelectedDate);
						const disabled = isDisabled(day);
						const inCurrentMonth = isCurrentMonthDay(day);

						const dayClassNames = [
							styles.calendarDay,
							selected ? styles.selected : '',
							isInRange(day) ? styles.inRange : '',
							inCurrentMonth ? styles.inCurrentMonth : styles.notInCurrentMonth,
							disabled ? styles.disabled : ''
						]
							.filter(Boolean)
							.join(' ');

						return (
							<div
								key={`${day.getMonth()}-${day.getDate()}-${index}`}
								className={dayClassNames}
								role='button'
								tabIndex={disabled || isAnimating ? -1 : 0}
								aria-disabled={disabled}
								onClick={() =>
									!disabled && !isAnimating && handleDateClick(day)
								}
								onKeyDown={e => {
									if (
										!disabled &&
										!isAnimating &&
										(e.key === 'Enter' || e.key === ' ')
									) {
										e.preventDefault();
										handleDateClick(day);
									}
								}}
							>
								{day.getDate()}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
);

Calendar.displayName = 'Calendar';
