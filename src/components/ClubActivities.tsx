import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { fetchNFTs } from '@/utils/nftFetcher'

interface Activity {
  id: number;
  type: 'discussion' | 'showcase';
  title: string;
  description: string;
  date: string;
  nftAddress?: string;
}

export function ClubActivities({ clubId }: { clubId: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    type: 'discussion',
    title: '',
    description: '',
    date: ''
  })
  const [userNFTs, setUserNFTs] = useState<any[]>([])
  const { address } = useWeb3Auth()

  useEffect(() => {
    if (address) {
      fetchNFTs(address).then(nfts => setUserNFTs(nfts))
    }
  }, [address])

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.date) {
      setActivities([...activities, { ...newActivity, id: Date.now() }])
      setNewActivity({ type: 'discussion', title: '', description: '', date: '' })
    }
  }

  const handleRemoveActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id))
  }

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Club Activities</h3>
      <div className="space-y-2 mb-4">
        <select
          value={newActivity.type}
          onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as 'discussion' | 'showcase' })}
          className="w-full p-2 border rounded"
        >
          <option value="discussion">Weekly Discussion</option>
          <option value="showcase">NFT Showcase</option>
        </select>
        <Input
          placeholder="Activity Title"
          value={newActivity.title}
          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
        />
        <Textarea
          placeholder="Activity Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={newActivity.date}
          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
        />
        {newActivity.type === 'showcase' && (
          <select
            value={newActivity.nftAddress}
            onChange={(e) => setNewActivity({ ...newActivity, nftAddress: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select NFT to showcase</option>
            {userNFTs.map((nft) => (
              <option key={nft.id} value={nft.contractAddress}>
                {nft.name}
              </option>
            ))}
          </select>
        )}
        <Button onClick={handleAddActivity}>Add Activity</Button>
      </div>
      <div>
        {activities.map((activity) => (
          <div key={activity.id} className="bg-secondary p-2 rounded mb-2">
            <h4 className="font-bold">{activity.title}</h4>
            <p>{activity.type === 'discussion' ? 'Weekly Discussion' : 'NFT Showcase'}</p>
            <p>{activity.description}</p>
            <p>Date: {new Date(activity.date).toLocaleString()}</p>
            {activity.type === 'showcase' && activity.nftAddress && (
              <p>NFT Address: {activity.nftAddress}</p>
            )}
            <Button onClick={() => handleRemoveActivity(activity.id)} variant="destructive" size="sm">
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}