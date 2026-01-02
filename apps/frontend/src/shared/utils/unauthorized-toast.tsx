import { toast } from 'sonner';
import { RoutePaths } from '../router';

export const unauthorizedToast = () => {
	toast.warning('Вы не авторизованы', {
		description: 'Пожалуйста, авторизуйтесь, чтобы продолжить работу.',
		action: {
			label: 'Войти',
			onClick: () => (window.location.href = RoutePaths.Auth.Login)
		},
		duration: 5000
	});
};
