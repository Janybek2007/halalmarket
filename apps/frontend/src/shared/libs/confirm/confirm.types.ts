export interface ConfirmContext {
	title: string;
	text: string;
	confirmText: string;
	cancelText: string;
	confirmCallback?: (args: { checked?: boolean }) => Promise<any>;
	cancelCallback?: VoidFunction;
	checkBox?: boolean;
	checkBoxText?: string;
}

export interface ConfirmContextValue {
	openConfirm: (item: ConfirmContext) => void;
	closeConfirm: VoidFunction;
}
