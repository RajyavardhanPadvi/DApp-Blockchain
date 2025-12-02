import React from 'react';

function VoterStatus({ account, status, candidates }) {
  if (!account) return null;

  const votedCandidate = status?.hasVoted 
    ? candidates.find(c => c.id === status.votedCandidateId) 
    : null;

  return (
    <div className="voter-status">
      <h3>Your Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <label>Account</label>
          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {account.address.slice(0, 10)}...{account.address.slice(-8)}
          </span>
        </div>
        <div className="status-item">
          <label>Role</label>
          <span>{account.role}</span>
        </div>
        <div className="status-item">
          <label>Registered</label>
          <span className={status?.isRegistered ? 'yes' : 'no'}>
            {status?.isRegistered ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="status-item">
          <label>Has Voted</label>
          <span className={status?.hasVoted ? 'yes' : 'no'}>
            {status?.hasVoted ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        {votedCandidate && (
          <div className="status-item">
            <label>Voted For</label>
            <span>{votedCandidate.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterStatus;
