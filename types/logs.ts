export interface LogEntry {
  timestamp: string
  type: string
  source_ip: string
  action_taken: string
  details: Record<string, any>
}
