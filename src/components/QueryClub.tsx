import React, { useState } from 'react';
import { IndexService } from "@ethsign/sp-sdk"; // Adjust the import path as necessary

export const QueryClub: React.FC = () => {
    const [data, setData] = useState<any>(null); // State to hold fetched data
    const [size, setSize] = useState<number>(10);
    const [clubId, setClubId] = useState<string>(''); // State for club ID input

    const getSchemaFromIndexService = async () => {
        const indexService = new IndexService("testnet");
        const res = await indexService.querySchema(`onchain_evm_11155111_${clubId}`); // Use the customizable club ID
        return res; // Ensure this matches the expected return type
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await getSchemaFromIndexService(); // Use the new function
            console.log(result); // Log the result to check its structure
            setData(result); // Store fetched data in state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={clubId} 
                    onChange={(e) => setClubId(e.target.value)} // Update club ID state
                    placeholder="Enter Club ID" 
                />
                <button type="submit">Search</button>
            </form>
            <div>
                {data && (
                    <div>
                        <h3>Club Name:{data.name}</h3> {/* Display the name */}
                        <p>Description:{data.description}</p> {/* Display the description */}
                        <p>Club Owner: {data.registrant}</p> {/* Display the registrant */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryClub;
