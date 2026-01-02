import { type ColumnDef } from '@tanstack/react-table';

export interface TableProps<T extends object> {
	columns: ColumnDef<T>[];
	data: T[];
	isLoading?: boolean;
	emptyNode?: React.ReactNode;
	className?: string;
	rowKey?: keyof T | string;
	maxHeight?: string;
	search?: string;
	searchColumn?: keyof T | string;
}
