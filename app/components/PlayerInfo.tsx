// components/PlayerInfo.tsx

interface PlayerData {
  name: string;
  position: number;
  started: boolean;
  isCurrentTurn: boolean;
}

interface PlayerInfoProps {
  user: PlayerData;
  bot: PlayerData;
}

export default function PlayerInfo({ user, bot }: PlayerInfoProps) {
  return (
    <div className="playerInfo ">
      <div className={`mx-28 player ${user.isCurrentTurn ? "active" : ""}`}>
        <div className="playerIcon">
          <div className={`playerMarker userMarker`}></div>
        </div>
        <div className="playerDetails">
          <h3>{user.name}</h3>
          <p>Position: {user.started ? user.position : "Not started"}</p>
        </div>
      </div>

      <div className={`player ${bot.isCurrentTurn ? "active" : ""}`}>
        <div className="playerIcon">
          <div className={`playerMarker botMarker`}></div>
        </div>
        <div className="playerDetails">
          <h3>{bot.name}</h3>
          <p>Position: {bot.started ? bot.position : "Not started"}</p>
        </div>
      </div>
    </div>
  );
}
