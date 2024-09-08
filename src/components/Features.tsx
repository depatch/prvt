import styles from '../styles/Features.module.css'

export default function Features() {
  const features = [
    { title: 'Chat private and onchain', icon: '💬' },
    { title: 'Create verifiable clubs', icon: '🏆' },
    { title: 'Use AI agents on chat', icon: '🤖' },
  ]

  return (
    <div className={styles.features}>
      <h2>Private</h2>
      <div className={styles.featureList}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <span className={styles.icon}>{feature.icon}</span>
            <span>{feature.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}