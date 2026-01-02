export interface ConfirmContext {
	title: string;
	text: string;
	confirmText: string;
	cancelText: string;
	confirmCallback?: VoidFunction;
	cancelCallback?: VoidFunction;
	isCloseConfirm?: boolean;
}

export interface ConfirmContextValue {
	openConfirm: (item: ConfirmContext) => void;
}
