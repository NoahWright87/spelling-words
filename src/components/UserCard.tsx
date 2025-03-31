interface UserCardProps {
  name?: string;
  onSelect: (name?: string) => void;
  onDelete?: (name: string) => void;
  showDelete?: boolean;
}

export function UserCard({ name, onSelect, onDelete, showDelete = false }: UserCardProps) {
  const isNewCard = !name;
  
  return (
    <div 
      className={`card ${isNewCard ? 'bg-success' : ''}`} 
      onClick={() => onSelect(name)}
    >
      <div className="card-content">
        <span className="text-xl font-medium">{isNewCard ? "+" : name}</span>
      </div>
      {showDelete && !isNewCard && (
        <>
          <div className="card-footer">Edit</div>
          <button
            className="card-close-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(name);
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
} 