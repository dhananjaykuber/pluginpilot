import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function App(): React.JSX.Element {
  return (
    <div className="p-8 space-x-2">
      <Button>Update</Button>
      <Badge variant="destructive">1 Vulnerability</Badge>
    </div>
  )
}

export default App
