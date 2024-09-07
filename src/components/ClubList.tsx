import styles from './ClubList.module.css'

export default function ClubList() {
  const clubs = [
    { name: 'Lit Protocol News', owner: 'kalayci.eth', type: 'dev-chat' },
    { name: 'Onchain Daily', owner: 'r3sat.eth', type: 'Magazine' },
  ]

  return (
    <div className={styles.clubList}>
      <div className={styles.header}>
        <h2>Discover latest clubs</h2>
        <button className={styles.createClub}>+ Create yours</button>
      </div>
      {clubs.map((club, index) => (
        <div key={index} className={styles.club}>
          <div className={styles.clubInfo}>
            <h3>{club.name}</h3>
            <p>{club.owner}</p>
            <span>{club.type}</span>
          </div>
          <button className={styles.joinButton}>Join with NFT</button>
        </div>
      ))}
      <button className={styles.seeAll}>See all →</button>
    </div>
  )
}