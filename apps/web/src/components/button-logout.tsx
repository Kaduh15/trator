import { useNavigate } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'

export function ButtonLogout() {
  const navigate = useNavigate({
    from: '/',
  })

  return (
    <Button
      aria-label="Sair"
      onClick={async () => {
        await authClient.signOut()
        navigate({
          to: '/login',
        })
      }}
      size="icon"
      type="button"
      variant="ghost"
    >
      <LogOutIcon className="size-4" />
    </Button>
  )
}
