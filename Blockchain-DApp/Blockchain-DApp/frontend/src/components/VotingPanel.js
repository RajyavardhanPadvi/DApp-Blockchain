import React from 'react';

function VotingPanel({ candidates, onVote, voterStatus, election, loading }) {
  const canVote = voterStatus?.isRegistered && !voterStatus?.hasVoted && election?.isActive;

  return (
    <div className="voting-panel">
      <h2>Cast Your Vote</h2>
      
      {!voterStatus?.isRegistered && (
        <div className="admin-warning">
          ⚠ You are not registered to vote. Please contact the admin to register.
        </div>
      )}
      
      {voterStatus?.hasVoted && (
        <div className="admin-warning" style={{ background: '#d1fae5', borderColor: '#059669', color: '#065f46' }}>
          ✅ You have already cast your vote for Candidate #{voterStatus.votedCandidateId}
        </div>
      )}

      <div className="candidates-grid">
        {candidates.map(candidate => (
          <div 
            key={candidate.id} 
            className={candidate-card ${voterStatus?.votedCandidateId === candidate.id ? 'voted' : ''}}
          >
            <div className="candidate-id">#{candidate.id}</div>
            <div className="candidate-name">{candidate.name}</div>
            <div className="candidate-party">{candidate.party}</div>
            <div className="vote-count">
              {candidate.voteCount} <span>votes</span>
            </div>
            
            {voterStatus?.votedCandidateId === candidate.id ? (
              <div className="voted-badge">
                ✓ You voted for this candidate
              </div>
            ) : (
              <button 
                className="vote-button"
                onClick={() => onVote(candidate.id)}
                disabled={!canVote || loading}
              >
                {loading ? 'Processing...' : 'Vote'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotingPanel;

