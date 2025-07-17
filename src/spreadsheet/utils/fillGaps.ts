export function fillGaps(orArr: number[], check: any = 1, fillWith: any = 1): number[] {
	let lastOneIndex: number | null = null; // index of the last "1" found
	let gapStart: number | null = null; // index where a gap starts

	const arr = [...orArr];

	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === check) {
			// When we find a "check", check if it's within proximity of the last "1"
			if (lastOneIndex !== null && (i - lastOneIndex - 1) <= 4) {
				// Fill in the gap with ones
				for (let j = gapStart!; j <= i; j++) {
					if (arr[j] === 0) {
						arr[j] = fillWith;
					}

				}
			}

			// Update the lastOneIndex and gapStart for the next iteration
			lastOneIndex = i;
			gapStart = i + 1;
		}
	}
	return arr;
}

type ItemType = "" | "AC" | "HDF" | "A" | "HDA";

export function fillGapsV2(arr: ItemType[]): ItemType[] {
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];

		if (item === "AC" || item === "HDF") {
			// Fill 4 previous positions
			for (let j = i - 1; j >= i - 4 && j >= 0; j--) {
				if (arr[j] === "") {
					arr[j] = item === "AC" ? "A" : "HDA";
				}
			}

			// Fill 4 next positions
			for (let j = i + 1; j <= i + 4 && j < arr.length; j++) {
				if (arr[j] === "") {
					arr[j] = item === "AC" ? "A" : "HDA";
				}
			}
		}
	}
	return arr;
}
