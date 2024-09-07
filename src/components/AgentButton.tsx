import styles from './AgentButton.module.css'

export default function AgentButton({ type }: { type: 'finder' | 'creator' }) {
  return (
    <button className={styles.agentButton}>
      {type === 'finder' ? 'Club finder agent' : 'Club creator agent'}
    </button>
  )
}