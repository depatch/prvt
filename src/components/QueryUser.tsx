import React, { useState } from 'react';
import { IndexService } from "@ethsign/sp-sdk"; // Adjust the import path as necessary

export const QueryUser: React.FC = () => {
    const [data, setData] = useState<any>(null); // State to hold fetched data
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [clubId, setClubId] = useState<string>(''); // State for club ID input

    const getAttestationListFromIndexService = async () => {
        const indexService = new IndexService("testnet");
        const res = await indexService.querySchema(`onchain_evm_11155111_${clubId}`);
        return res;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await getAttestationListFromIndexService(); 
            console.log(result); // Log the result to check its structure
            setData(result); // Store fetched data in state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent going below page 1
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
                <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={handleNextPage}>Next</button>
            </div>
            <div>
            </div>
        </div>
    );
};

export default QueryUser;
