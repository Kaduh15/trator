import { auth } from '..'

async function createCreds() {
  await auth.api.signUpEmail({
    body: {
      email: 'trator@email.com',
      password: '12345678',
      name: 'Trator',
      username: 'trator',
    },
  })

  await auth.api.signUpEmail({
    body: {
      email: 'gerente@email.com',
      password: '12345678',
      name: 'Gerente',
      username: 'gerente',
    },
  })
}

await createCreds()
