export interface CalendarProps {
	selectedDate: string | null;
	onSelectDate: (date: string) => void;
	otherDate: string | null;
	isStartDate: boolean;
	onClose: VoidFunction;
}
