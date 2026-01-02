export interface DropdownOption {
	label: React.ReactNode;
	onClick?: VoidFunction;
	to?: string;
	custom?: (args: {
		onClose: VoidFunction;
		className: string;
	}, i:number) => React.ReactNode;
}

export interface DropdownProps {
	trigger: (props: {
		isOpen: boolean;
		toggle: VoidFunction;
	}) => React.ReactNode;
	options: DropdownOption[];
	className?: string;
}
