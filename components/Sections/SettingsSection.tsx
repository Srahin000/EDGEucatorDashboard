'use client';

import React from 'react';
import { PrivacyCard } from '../Settings/PrivacyCard';
import { ParentalControlsCard } from '../Settings/ParentalControlsCard';
import { DataManagementCard } from '../Settings/DataManagementCard';
import { DataSyncCard } from '../Settings/DataSyncCard';
import { ChildProfilesCard } from '../Settings/ChildProfilesCard';
import { ChalkText } from '../Layout/ChalkText';

export const SettingsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="green" speed={30}>Privacy & Data Controls</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          How do I know this is safe for my child?
        </p>
      </div>
      
      <PrivacyCard />
      <ParentalControlsCard />
      <DataManagementCard />
      <DataSyncCard />
      <ChildProfilesCard />
    </div>
  );
};

