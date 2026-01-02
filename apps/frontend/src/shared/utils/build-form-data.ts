export function buildFormData(body: any) {
	const fd = new FormData();
	for (const [key, value] of Object.entries(body)) {
		if (value instanceof File) {
			fd.append(key, value);
		} else if (typeof value === 'string') {
			fd.append(key, value);
		} else if (typeof value === 'number' || typeof value === 'boolean') {
			fd.append(key, String(value));
		}
	}
	return fd;
}

export function buildProductFormData(body: any) {
	const fd = new FormData();

	for (const [key, value] of Object.entries(body)) {
		if (key === 'images' && Array.isArray(value)) {
			value.forEach(item => {
				if (item.file instanceof File) {
					fd.append('images_files', item.file);
				} else if (item.isDeleted && item.id) {
					fd.append('images_deleted', item.id);
				}
			});
		} else if (value instanceof File) {
			fd.append(key, value);
		} else if (typeof value === 'string') {
			fd.append(key, value);
		} else if (typeof value === 'number' || typeof value === 'boolean') {
			fd.append(key, String(value));
		}
	}

	return fd;
}
