import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

const { auth, findMany } = vi.hoisted(() => ({ auth: vi.fn(), findMany: vi.fn() }))
vi.mock('@/server/auth', () => ({ authenticate: auth }))
vi.mock('@/server/prisma', () => ({ prisma: { doacao: { findMany } } }))

describe('GET /api/doacoes', () => {
  beforeEach(() => vi.resetAllMocks())

  it('impede acesso ao banco quando a autenticação falha', async () => {
    auth.mockReturnValue({ error: NextResponse.json({ error: 'Token inválido' }, { status: 401 }) })
    const response = await GET(new NextRequest('http://localhost/api/doacoes'))
    expect(response.status).toBe(401)
    expect(findMany).not.toHaveBeenCalled()
  })

  it('retorna os contatos das doações para usuários autenticados', async () => {
    const donations = [{ id: '1', nomeCompleto: 'Ana', whatsapp: '93999991234', tipos: ['racao'], observacoes: null }]
    auth.mockReturnValue({ userId: 'user', token: 'token' })
    findMany.mockResolvedValue(donations)
    const response = await GET(new NextRequest('http://localhost/api/doacoes'))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(donations)
  })
})
