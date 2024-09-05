import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ethers } from 'ethers'
import ABI from '@/abis/Agent.json'

interface WebSearchResult {
  result: string;
  error: string;
}

export function GaladrielSpamRemover() {
  const [isActive, setIsActive] = useState(false)
  const [spamRules, setSpamRules] = useState('')
  const [agentRunId, setAgentRunId] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [searchResults, setSearchResults] = useState<WebSearchResult | null>(null)

  const contractAddress = process.env.NEXT_PUBLIC_GALADRIEL_AGENT_CONTRACT_ADDRESS
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
  const serperApiKey = process.env.NEXT_PUBLIC_SERPER_API_KEY

  useEffect(() => {
    if (isActive && agentRunId !== null) {
      const interval = setInterval(async () => {
        await getNewMessages()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isActive, agentRunId])

  const handleActivate = async () => {
    if (!isActive) {
      await startAgent()
    } else {
      setIsActive(false)
      setAgentRunId(null)
    }
  }

  const startAgent = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress!, ABI, signer)

      // Perform a web search for recent spam trends
      const searchResult = await executeWebSearch("recent spam trends and techniques")
      setSearchResults(searchResult)

      let query = "Monitor chat messages and remove spam based on the following rules: " + spamRules
      if (searchResult && searchResult.result) {
        query += "\nAdditional context from recent web search: " + searchResult.result
      }

      const maxIterations = 10  // Adjust as needed

      const transactionResponse = await contract.runAgent(query, maxIterations)
      const receipt = await transactionResponse.wait()

      const runId = getAgentRunId(receipt, contract)
      if (runId !== undefined) {
        setAgentRunId(runId)
        setIsActive(true)
        console.log(`Galadriel agent started with run ID: ${runId}`)
      }
    } catch (error) {
      console.error("Failed to start Galadriel agent:", error)
    }
  }

  const getNewMessages = async () => {
    if (!agentRunId) return

    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(contractAddress!, ABI, provider)

      const newMessages = await contract.getMessageHistory(agentRunId)
      const formattedMessages = newMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content[0].value,
      }))

      setMessages(formattedMessages)

      if (await contract.isRunFinished(agentRunId)) {
        setIsActive(false)
        setAgentRunId(null)
      }
    } catch (error) {
      console.error("Failed to get new messages:", error)
    }
  }

  const getAgentRunId = (receipt: ethers.providers.TransactionReceipt, contract: ethers.Contract) => {
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log)
        if (parsedLog && parsedLog.name === "AgentRunCreated") {
          return ethers.BigNumber.from(parsedLog.args[1]).toNumber()
        }
      } catch (error) {
        console.log("Could not parse log:", log)
      }
    }
  }

  const executeWebSearch = async (query: string): Promise<WebSearchResult> => {
    try {
      const response = await fetch('/api/serper-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute web search');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Web search error:", error);
      return {
        result: "",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Galadriel Spam Remover</h3>
      <p className="text-sm text-muted-foreground mb-4">Automatically detects and removes spam messages</p>
      <Button onClick={handleActivate} variant={isActive ? "secondary" : "default"}>
        {isActive ? 'Deactivate' : 'Activate'}
      </Button>
      <div className="mt-4">
        <Textarea
          placeholder="Enter spam detection rules"
          value={spamRules}
          onChange={(e) => setSpamRules(e.target.value)}
          className="mb-2"
        />
      </div>
      {searchResults && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Recent Spam Trends:</h4>
          <p className="text-sm">{searchResults.result}</p>
        </div>
      )}
      {isActive && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Agent Messages:</h4>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.role === 'assistant' ? 'bg-blue-100' : 'bg-green-100'}`}>
              <strong>{msg.role === 'assistant' ? 'Thought' : 'Step'}:</strong> {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}