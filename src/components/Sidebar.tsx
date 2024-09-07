import styles from './Sidebar.module.css'
import AgentButton from './AgentButton'
import UserProfile from './UserProfile'
import ChatList from './ChatList'
import ClubList from './ClubList'

export default function Sidebar({ setActiveChat }: { setActiveChat: (chat: any) => void }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.agentButtons}>
        <AgentButton type="finder" />
        <AgentButton type="creator" />
      </div>
      <UserProfile />
      <ChatList setActiveChat={setActiveChat} />
      <ClubList />
    </div>
  )
}