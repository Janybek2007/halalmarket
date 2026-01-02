import { SellersTab } from '~/shared/types/sellers-tab';
import { InputOnChange } from '~/shared/ui/input/input.types';

export interface SellersFilterProps {
	tab: SellersTab | null;
	onTab: (tab: SellersTab) => void;
	selectedIds: string[];
	refetch: VoidFunction;
	searchBind: {
		value: string;
		onChange: InputOnChange;
	};
}
