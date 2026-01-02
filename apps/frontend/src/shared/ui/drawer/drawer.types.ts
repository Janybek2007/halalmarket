export type DrawerProps = {
  onClose: VoidFunction;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
  header?: React.ReactNode;
};
