"use client";

import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

export default function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = debounce(() => {
			setDebouncedValue(value);
		}, delay);

		handler();
		return () => {
			handler.cancel();
		};
	}, [value, delay]);

	return debouncedValue;
}
