import styles from '../styles/AgentButton.module.css'

interface AgentButtonProps {
  type: "finder" | "creator";
  onClick: () => void;
}

export default function AgentButton({ type, onClick }: AgentButtonProps) {
  return (
    <button className={styles.agentButton} onClick={onClick}>
      {type === 'finder' ? 'Club finder agent' : 'Club creator agent'}
    </button>
  )
}