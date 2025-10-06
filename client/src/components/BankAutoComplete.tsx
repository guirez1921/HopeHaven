import { useState } from "react";

type Props = {
    allBanks: string[];
    value: string;
    error: string;
    onChange: (val: string) => void;
};

const BankAutocomplete: React.FC<Props> = ({ allBanks, value, error, onChange }) => {
    const [filteredBanks, setFilteredBanks] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        onChange(inputVal);

        if (inputVal.trim() === "") {
            setFilteredBanks([]);
            setShowDropdown(false);
            return;
        }

        // Case-insensitive match
        const matches = allBanks.filter((bank) =>
            bank.toLowerCase().includes(inputVal.toLowerCase())
        );
        setFilteredBanks(matches);
        setShowDropdown(matches.length > 0);
    };

    const handleSelect = (bank: string) => {
        onChange(bank);
        setFilteredBanks([]);
        setShowDropdown(false);
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Bank Name *</label>
            <div className="relative w-full">
                <input
                    type="text"
                    value={value}
                    onChange={handleInput}
                    onFocus={() => {
                        if (filteredBanks.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Search bank"
                    className="w-full px-4 py-3 border rounded-lg"
                />

                {showDropdown && (
                    <ul className="absolute z-10 w-full overflow-y-auto bg-white border rounded-lg shadow-md max-h-40">
                        {filteredBanks.map((bank, i) => (
                            <li
                                key={i}
                                onClick={() => handleSelect(bank)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {bank}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        </div>
    );
};
export default BankAutocomplete;