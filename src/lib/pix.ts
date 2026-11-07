/** Chave PIX como aparece na tela: CNPJ e CPF ganham a pontuação; o resto fica como está. */
export function formatarChavePix(chave: string, tipo: string) {
  const digitos = chave.replace(/\D/g, '');
  if (/cnpj/i.test(tipo) && digitos.length === 14)
    return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  if (/cpf/i.test(tipo) && digitos.length === 11)
    return digitos.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  return chave;
}
