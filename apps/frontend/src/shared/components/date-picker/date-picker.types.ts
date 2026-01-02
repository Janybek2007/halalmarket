import type { useDatePicker } from '~/shared/hooks/use-date-picker';

export interface DatePickerProps extends ReturnType<typeof useDatePicker> {
  className?: string;
}
