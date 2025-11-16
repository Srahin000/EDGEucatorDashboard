// Component for syncing conversations from disk
// Allows users to manually import conversations or set up auto-sync

import React, { useState } from 'react';
import { FolderOpen, Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { readConversationDirectory, readConversationFiles } from '@/lib/browserFileReader';
import { useChildContext } from '@/contexts/ChildContext';

export const DataSyncCard: React.FC = () => {
  const { children, refreshChildren } = useChildContext();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    processed?: number;
    failed?: number;
  }>({ type: null, message: '' });

  const { selectedChild } = useChildContext();

  const handleDirectorySync = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: null, message: 'Select conversations directory...' });

    try {
      const childId = selectedChild?.id || children[0]?.id;
      if (!childId) {
        setSyncStatus({
          type: 'error',
          message: 'Please select a child first',
        });
        setIsSyncing(false);
        return;
      }

      const result = await readConversationDirectory(childId);
      setSyncStatus({
        type: 'success',
        message: `Successfully processed ${result.processed} conversations`,
        processed: result.processed,
        failed: result.failed,
      });
      await refreshChildren();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setSyncStatus({ type: null, message: 'Cancelled' });
      } else {
        setSyncStatus({
          type: 'error',
          message: error.message || 'Failed to sync conversations',
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSyncing(true);
    setSyncStatus({ type: null, message: 'Processing files...' });

    try {
      const childId = selectedChild?.id || children[0]?.id;
      if (!childId) {
        setSyncStatus({
          type: 'error',
          message: 'Please select a child first',
        });
        setIsSyncing(false);
        return;
      }

      const result = await readConversationFiles(files, childId);
      setSyncStatus({
        type: 'success',
        message: `Processed ${result.processed} conversation(s)`,
        processed: result.processed,
        failed: result.failed,
      });
      await refreshChildren();
    } catch (error: any) {
      setSyncStatus({
        type: 'error',
        message: error.message || 'Failed to process files',
      });
    } finally {
      setIsSyncing(false);
      // Reset input
      e.target.value = '';
    }
  };

  if (children.length === 0) {
    return (
      <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sync Conversations</h3>
        <p className="text-gray-600 text-sm">
          Add a child profile first to sync conversations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-pastel-blue rounded-xl p-6 shadow-lg border-2 border-blue-200/50 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-blue/10 rounded-lg">
          <FolderOpen className="w-6 h-6 text-accent-blue" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Sync Conversations from Disk</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Import conversations directly from your voice assistant's conversation files.
        Select the conversations directory or upload metadata.json files.
      </p>

      <div className="space-y-3">
        {/* Directory Sync */}
        <button
          onClick={handleDirectorySync}
          disabled={isSyncing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl font-bold hover:bg-primary-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <FolderOpen className="w-5 h-5" />
              Select Conversations Directory
            </>
          )}
        </button>

        {/* File Upload */}
        <label className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-green text-white rounded-xl font-bold hover:bg-accent-green/90 cursor-pointer transition-all shadow-lg hover:shadow-xl">
          <Upload className="w-5 h-5" />
          Upload metadata.json Files
          <input
            type="file"
            multiple
            accept="application/json"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isSyncing}
          />
        </label>

        {/* Status Message */}
        {syncStatus.message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border-2 ${
              syncStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : syncStatus.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}
          >
            {syncStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : syncStatus.type === 'error' ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <RefreshCw className="w-5 h-5 animate-spin" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{syncStatus.message}</p>
              {syncStatus.processed !== undefined && (
                <p className="text-xs mt-1">
                  Processed: {syncStatus.processed} | Failed: {syncStatus.failed || 0}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

