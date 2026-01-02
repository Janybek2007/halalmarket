import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from '~/app/providers/session';
import { http } from '~/shared/api/http';
import { UpdateUserDto, UpdateUserSchema } from './use-upadte.contract';

export const useUserUpdateMutation = () => {
	const { user: profile } = useSession();
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

	const form = useForm<UpdateUserDto>({
		resolver: zodResolver(UpdateUserSchema)
	});

	const { mutateAsync: updateProfile, error: apiError } = useMutation({
		mutationKey: ['update-user'],
		mutationFn: (parsedBody: UpdateUserDto) =>
			http.patch('user/profile/', parsedBody)
	});
	const { mutateAsync: uploadAvatar, error: apiError2 } = useMutation({
		mutationKey: ['upload-avatar_user'],
		mutationFn: (file: File) => {
			const body = new FormData();
			body.append('file', file);
			return http.post('user/upload-avatar/', body);
		}
	});

	const onSubmit = React.useCallback(
		async (data: UpdateUserDto) => {
			toast.promise(
				async () => {
					if (selectedFile) await uploadAvatar(selectedFile);
					await updateProfile(data);
				},
				{
					loading: 'Обновление...',
					success: 'Профиль успешно обновлен',
					error: 'Ошибка при обновлении профиля'
				}
			);
		},
		[updateProfile, uploadAvatar, selectedFile]
	);

	React.useEffect(() => {
		if (profile) {
			form.setValue('full_name', profile.full_name);
			form.setValue('email', profile.email);
			form.setValue('phone', profile.phone);
		}
	}, [profile]);

	return {
		form,
		onsubmit: form.handleSubmit(onSubmit),
		setSelectedFile,
		selectedFile,
		apiError,
		apiError2
	};
};
