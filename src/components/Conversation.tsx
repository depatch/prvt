import React from "react";

interface ConversationProps {
    conversation: {
        peerAddress: string;
    };
}

export const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
    return (
        <div>
            <h2 className="text-lg font-medium">Conversation with {conversation.peerAddress}</h2>
            {/* Render the conversation details here */}
        </div>
    );
};