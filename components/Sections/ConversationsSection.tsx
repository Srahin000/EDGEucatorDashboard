'use client';

import React, { useState } from 'react';
import { ConversationList } from '../Conversations/ConversationList';
import { ConversationDetailDrawer } from '../Conversations/ConversationDetailDrawer';
import { Conversation } from '@/types';
import { ChalkText } from '../Layout/ChalkText';

export const ConversationsSection: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="yellow" speed={30}>Conversations</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">Recent conversational sessions and highlights</p>
      </div>
      <ConversationList onConversationClick={setSelectedConversation} />
      {selectedConversation && (
        <ConversationDetailDrawer
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};

