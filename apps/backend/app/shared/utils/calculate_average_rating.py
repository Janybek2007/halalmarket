from typing import List


def calculate_average_rating(ratings: List[int | float]) -> float:
    if not ratings:
        return 0.0
    total = sum(ratings)
    average = total / len(ratings)
    return round(average, 2)
