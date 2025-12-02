import React, { useState } from 'react';

function AdminPanel({ testAccounts, onRegisterVoter, onAddCandidate, selectedAccount }) {
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  const isAdmin = selectedAccount?.role === 'Admin';

  const handleRegisterVoter = (e) => {
    e.preventDefault();
    if (newVoterAddress) {
      onRegisterVoter(newVoterAddress);
      setNewVoterAddress('');
    }
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (candidateName && candidateParty) {
      onAddCandidate(candidateName, candidateParty);
      setCandidateName('');
      setCandidateParty('');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      {!isAdmin && (
        <div className="admin-warning">
          ⚠ You need to select the Admin account to perform admin actions.
          Current account: {selectedAccount?.role || 'None'}
        </div>
      )}

      <div className="admin-section">
        <h3>Register New Voter</h3>
        <form onSubmit={handleRegisterVoter}>
          <div className="form-group">
            <label>Select Account to Register</label>
            <select 
              value={newVoterAddress} 
              onChange={(e) => setNewVoterAddress(e.target.value)}
            >
              <option value="">-- Select Account --</option>
              {testAccounts.filter(a => a.role !== 'Admin').map(account => (
                <option key={account.address} value={account.address}>
                  {account.role} - {account.address.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="admin-button" disabled={!isAdmin}>
            Register Voter
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Add New Candidate</h3>
        <form onSubmit={handleAddCandidate}>
          <div className="form-group">
            <label>Candidate Name</label>
            <input 
              type="text" 
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter candidate name"
            />
          </div>
          <div className="form-group">
            <label>Party</label>
            <input 
              type="text" 
              value={candidateParty}
              onChange={(e) => setCandidateParty(e.target.value)}
              placeholder="Enter party name"
            />
          </div>
          <button type="submit" className="admin-button" disabled={!isAdmin}>
            Add Candidate
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Test Accounts</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#e2e8f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Address</th>
              </tr>
            </thead>
            <tbody>
              {testAccounts.map(account => (
                <tr key={account.address} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{account.role}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>
                    {account.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
