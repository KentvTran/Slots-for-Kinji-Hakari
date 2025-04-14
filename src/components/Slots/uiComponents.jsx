export const AuthMessage = () => {
    return (
      <div className="auth-message">
        <p>Please sign in to play!</p>
      </div>
    )
  }
  
  export const GameStatus = ({ status }) => {
    return (
      <div className="game-status">
        <p>{status}</p>
      </div>
    )
  }
  