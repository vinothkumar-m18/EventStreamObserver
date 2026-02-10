import '../styles/EventCard.css';
const EventCard = ({ event }) => {    
    if (!event || !event.payload) return null;
    const { eventType, payload, source, createdAt } = event;
    const repoName = payload.repository?.full_name || 'Unknown Repo';
    const branch = payload.ref?.replace("refs/heads/", "") || 'Unknown';
    const commit = payload.head_commit || {};
    const author = commit.author?.name || payload.pusher?.name || "Unknown";
    const message = commit.message || "No commit message";
    const timestamp = commit.timestamp || createdAt;
    const filesChanged = commit.modified || [];
    const commitUrl = commit.url;
    return (
        <>
            <div className="event-card">
                {/* header */}
                <div className="event-card-header">
                    <h3>{repoName} @ {branch}</h3>
                    <span className="event-type">{eventType}</span>
                </div>
                {/* Body */}
                <div className="event-card-body">
                    <p className="commit-message"><strong>{message}</strong></p>
                    <p className="author">By: {author}</p>
                    <p>{new Date(timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                    {filesChanged.length > 0 && (
                        <div className = "files">
                            <p>Files Changed</p>
                            <ul>
                                {filesChanged.map((file, idx) => (
                                    <li key={idx}>
                                        <p>{file}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
                {/* Footer  */}
                <div className = "event-card-footer">
                    {commitUrl && (
                        <a href={commitUrl} target="_blank" rel = "noopener noreferrer">View Commit</a>
                    )}
                    <span className = "source">Source: {source?.service}</span>
                    <span className = "source">User:{source?.user?.email || 'no email available'}</span>
                </div>
            </div>
        </>
    );
};
export default EventCard;