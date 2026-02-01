import { useState } from 'react';
import { exportData, importData } from '../db/exportImport';
import './Settings.css';

function Settings() {
    const [importing, setImporting] = useState(false);

    const handleExport = async () => {
        const success = await exportData();
        if (success) {
            alert('✅ Data exported successfully! Check your downloads folder.');
        } else {
            alert('❌ Failed to export data. Check console for details.');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            await importData(file);
            alert('✅ Data imported successfully! Refreshing page...');
            window.location.reload();
        } catch (error) {
            alert('❌ Failed to import data. Make sure the file is a valid backup.');
            setImporting(false);
        }
    };

    return (
        <div className="settings">
            <header className="page-header">
                <h1>Settings</h1>
                <p className="text-muted">Manage your data and preferences</p>
            </header>

            <section className="settings-section card">
                <h3>📦 Data Management</h3>
                <p className="text-muted">
                    Your workout data is stored locally in your browser. Use these tools to backup
                    and transfer your data between devices.
                </p>

                <div className="settings-actions">
                    <button className="btn btn-primary" onClick={handleExport}>
                        📥 Export Data
                    </button>

                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                        📤 Import Data
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            disabled={importing}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="info-box">
                    <strong>💡 How it works:</strong>
                    <ul>
                        <li><strong>Export:</strong> Downloads all your data as a JSON file</li>
                        <li><strong>Import:</strong> Restores data from a backup file</li>
                        <li><strong>Transfer:</strong> Export on one device, import on another</li>
                    </ul>
                </div>
            </section>

            <section className="settings-section card">
                <h3>ℹ️ About</h3>
                <div className="about-info">
                    <p><strong>Gym Progress Tracker</strong></p>
                    <p className="text-muted">Version 1.0.0</p>
                    <p className="text-muted mt-sm">
                        A privacy-focused workout tracking app. All your data stays on your device.
                    </p>
                    <a
                        href="https://github.com/serhataydilek/gym-progress-tracker"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-secondary mt-md"
                    >
                        View on GitHub
                    </a>
                </div>
            </section>
        </div>
    );
}

export default Settings;
