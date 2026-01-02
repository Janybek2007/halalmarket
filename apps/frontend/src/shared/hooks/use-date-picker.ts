'use client';

import { useQueryString } from '~/shared/hooks';
import { formatDateCustom } from '~/shared/utils/date';

export const useDatePicker = () => {
	const getDefaultDates = () => {
		const today = new Date();

		const endDate = new Date(today);
		endDate.setDate(today.getDate() + 1);

		return {
			end: formatDateCustom(endDate, 'yyyy-MM-dd')
		};
	};

	const { end: defaultEnd } = getDefaultDates();

	const [startDate, setStartDate] = useQueryString('_startDate', '');
	const [endDate, setEndDate] = useQueryString('_endDate', defaultEnd);

	return {
		startDate: { value: startDate ?? '', setValue: setStartDate },
		endDate: { value: endDate ?? '', setValue: setEndDate }
	};
};
