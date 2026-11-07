// Dados estruturados (schema.org) da igreja para o Google: endereço, telefone, redes e horários
// dos cultos — tudo derivado de src/content. Nada inventado: sem coordenadas até termos as reais.
import { getEndereco, getEventos, getIgreja, getOrdenados, getRedes } from './igreja';

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function jsonLdIgreja(site: URL) {
  const igreja = await getIgreja();
  const end = await getEndereco();
  const redes = await getRedes();
  const cultos = await getOrdenados('cultos');
  const eventos = (await getEventos()).filter(
    (e) => !e.mock && e.data >= new Date().toISOString().slice(0, 10),
  );
  const url = site.href;

  const church = {
    '@type': 'Church',
    '@id': `${url}#igreja`,
    name: igreja.nome,
    description: igreja.bio,
    slogan: igreja.slogan,
    url,
    logo: new URL('/apple-touch-icon.png', site).href,
    image: new URL('/og-image.jpg', site).href,
    ...(igreja.contato.mock ? {} : { telephone: `+${igreja.contato.whatsapp}` }),
    ...(igreja.contato.email ? { email: igreja.contato.email } : {}),
    foundingDate: igreja.fundacao,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${end.rua} - ${end.bairro}`,
      addressLocality: end.cidade,
      addressRegion: end.uf,
      postalCode: end.cep,
      addressCountry: 'BR',
    },
    hasMap: end.googleMaps,
    sameAs: redes.map((r) => r.href),
    // só os semanais: OpeningHoursSpecification não expressa "1º domingo do mês" (a Ceia)
    openingHoursSpecification: cultos
      .filter((c) => c.ocorrencia === 'semanal')
      .map((c) => ({
        '@type': 'OpeningHoursSpecification',
        name: c.nome,
        dayOfWeek: `https://schema.org/${DIAS[c.diaSemana]}`,
        opens: c.hora,
      })),
  };

  const evts = eventos.map((e) => ({
    '@type': 'Event',
    name: e.titulo,
    description: e.descricao,
    startDate: `${e.data}T${e.hora}:00-03:00`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@id': `${url}#igreja` },
    organizer: { '@id': `${url}#igreja` },
  }));

  return { '@context': 'https://schema.org', '@graph': [church, ...evts] };
}
