export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}
