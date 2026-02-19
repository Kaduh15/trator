import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

import { authClient } from '@/lib/auth-client'

import Loader from './loader'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function LoginForm() {
  const navigate = useNavigate({
    from: '/',
  })
  const { isPending } = authClient.useSession()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.username(
        {
          password: value.password,
          username: value.username,
        },
        {
          onSuccess: async () => {
            const session = await authClient.getSession()

            navigate({
              to:
                session.data?.user.role === 'admin'
                  ? '/dashboard'
                  : '/trator/horas',
            })

            toast.success('Sign in successful')
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText)
          },
        }
      )
    },
    validators: {
      onSubmit: z.object({
        username: z.string().min(2, 'Username must be at least 2 characters'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  })

  if (isPending) {
    return <Loader />
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field name="username">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Username</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500" key={error?.message}>
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500" key={error?.message}>
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
              type="submit"
            >
              {state.isSubmitting ? 'Submitting...' : 'Sign In'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
