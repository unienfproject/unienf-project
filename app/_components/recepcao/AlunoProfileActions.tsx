"use client";

import { Button } from "@/app/_components/ui/button";
import { CreditCard, DollarSign, FileCheck, Printer, User } from "lucide-react";
import Link from "next/link";

type Props = {
  studentId: string;
  studentName: string;
};

export default function AlunoProfileActions({ studentId, studentName }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild variant="default" size="sm">
        <Link href={`/recepcao/alunos/${studentId}#financeiro`}>
          <DollarSign className="mr-2 h-4 w-4" />
          Registrar Pagamento
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link href={`/recepcao/financeiro?studentId=${studentId}`}>
          <CreditCard className="mr-2 h-4 w-4" />
          Ver Financeiro
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link href={`/recepcao/alunos/${studentId}/documentos`}>
          <FileCheck className="mr-2 h-4 w-4" />
          Checklist Documentos
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link href={`/recepcao/alunos/${studentId}#dados-pessoais`}>
          <User className="mr-2 h-4 w-4" />
          Atualizar Contato
        </Link>
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Ficha
      </Button>
    </div>
  );
}
