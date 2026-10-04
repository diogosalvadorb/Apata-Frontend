import { NextResponse, type NextRequest } from "next/server";
import { authenticate } from "@/server/auth";
import { prisma } from "@/server/prisma";

export async function GET(request: NextRequest) {
  const auth = authenticate(request);
  if ("error" in auth) return auth.error;

  try {
    const donations = await prisma.doacao.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nomeCompleto: true,
        whatsapp: true,
        tipos: true,
        observacoes: true,
      },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Erro ao listar doações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar doações" },
      { status: 500 },
    );
  }
}
