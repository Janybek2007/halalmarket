#!/usr/bin/env python3
"""
Скрипт для удаления файлов из media папки на основе CSV файлов с ссылками
"""
import csv
import os
from pathlib import Path


def delete_files_from_csv(csv_file_path, media_root):
    """Удаляет файлы из media на основе CSV файла"""
    deleted_count = 0
    not_found_count = 0

    print(f"\nОбработка файла: {csv_file_path}")

    if not os.path.exists(csv_file_path):
        print(f"  Файл не найден: {csv_file_path}")
        return deleted_count, not_found_count

    with open(csv_file_path, "r", encoding="utf-8") as file:
        reader = csv.reader(file)

        for row in reader:
            if not row or len(row) == 0:
                continue

            file_path = row[0].strip()

            # Пропускаем пустые строки и точки
            if not file_path or file_path == "." or file_path == "":
                continue

            # Формируем полный путь к файлу
            full_path = media_root / file_path

            # Проверяем существование файла
            if full_path.exists() and full_path.is_file():
                try:
                    full_path.unlink()
                    deleted_count += 1
                    print(f"  ✓ Удален: {file_path}")
                except Exception as e:
                    print(f"  ✗ Ошибка удаления {file_path}: {e}")
            else:
                not_found_count += 1
                print(f"  - Файл не найден: {file_path}")

    return deleted_count, not_found_count


def main():
    """Главная функция"""
    print("Проверка и удаление файлов из _media папки...")

    # Пути к папкам
    project_root = Path(__file__).resolve().parent
    media_root = project_root / "app" / "media"
    media_backup_root = project_root / "app" / "_media"

    if not media_root.exists():
        print(f"Папка media не найдена: {media_root}")
        return

    if not media_backup_root.exists():
        print(f"Папка _media не найдена: {media_backup_root}")
        return

    print(f"Папка media: {media_root}")
    print(f"Папка _media: {media_backup_root}")

    # Получаем все файлы в media папке
    print(f"\nСканирование media папки...")
    media_files = set()
    for file_path in media_root.rglob("*"):
        if file_path.is_file():
            relative_path = file_path.relative_to(media_root)
            relative_path_str = str(relative_path).replace("\\", "/")
            media_files.add(relative_path_str)

    print(f"Найдено файлов в media: {len(media_files)}")

    # Получаем все файлы в _media папке
    print(f"\nСканирование _media папки...")
    backup_files = set()
    for file_path in media_backup_root.rglob("*"):
        if file_path.is_file():
            relative_path = file_path.relative_to(media_backup_root)
            relative_path_str = str(relative_path).replace("\\", "/")
            backup_files.add(relative_path_str)

    print(f"Найдено файлов в _media: {len(backup_files)}")

    # Находим файлы, которые есть в _media но нет в media
    files_to_delete = backup_files - media_files

    print(
        f"\nФайлов для удаления (есть в _media, но нет в media): {len(files_to_delete)}"
    )

    if not files_to_delete:
        print("Отлично! Все файлы в _media есть в media.")
        return

    # Показываем список файлов для удаления
    print("\nСписок файлов (есть в _media, но нет в media):")
    total_size = 0
    for file_path in sorted(files_to_delete):
        full_path = media_backup_root / file_path
        if full_path.exists():
            size = full_path.stat().st_size
            total_size += size
            size_mb = size / (1024 * 1024)
            print(f"  {file_path} ({size_mb:.2f} МБ)")

    total_size_mb = total_size / (1024 * 1024)
    print(f"\nОбщий размер: {total_size_mb:.2f} МБ")
    print(f"Всего файлов: {len(files_to_delete)}")
    print("\nПроверка завершена. Удаление не выполнялось.")


if __name__ == "__main__":
    main()
