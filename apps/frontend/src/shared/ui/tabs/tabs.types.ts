export interface TabsProps<T = string> {
  tabs: { label: string; value: T }[];
  activeTab?: T;
  onChange?: (tab: T) => void;
  className?: string;
}
