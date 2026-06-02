import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { movieId, userId, habitLog, careerLevel, studioName } = await req.json();

    const total = Object.values(habitLog as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
    const dominant = total === 0
      ? 'variados'
      : Object.entries(habitLog as Record<string, number>)
          .sort(([, a], [, b]) => b - a).slice(0, 2)
          .map(([cat, count]) => `${Math.round(count / total * 100)}% ${cat}`).join(', ');

    const baseRating = (3.0 + Math.min(careerLevel * 0.2, 1.5) + Math.random() * 0.5).toFixed(1);
    const audRating = (Math.min(parseFloat(baseRating) + 0.2, 5.0)).toFixed(1);

    const prompt = `Eres un crítico de cine especializado en cine independiente y festivales internacionales. Genera una ficha para una película indie imaginaria que refleje el crecimiento personal de su directora. Tono artístico, emotivo y específico. Nunca genérico.

Datos:
- Hábitos dominantes durante la producción: ${dominant}
- Nivel de carrera de la directora: ${careerLevel}/7
- Nombre del estudio: ${studioName}

Responde ÚNICAMENTE con JSON válido sin texto extra:
{"title":"título poético en español 2-4 palabras","genre":"género específico en español ej Drama contemplativo","tagline":"frase de 8-12 palabras","synopsis":"60-80 palabras evocadoras en español sin nombres de personajes","director_note":"nota de la directora en primera persona 20-30 palabras","critic_rating":${baseRating},"audience_rating":${audRating},"festival":"nombre de festival ficticio europeo o latinoamericano"}`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.9, max_tokens: 600 }),
    });

    const openaiData = await openaiRes.json();
    let movieData: Record<string, unknown>;
    try {
      movieData = JSON.parse(openaiData.choices[0].message.content.trim());
    } catch {
      movieData = {
        title: 'Las Horas Azules', genre: 'Drama contemplativo',
        tagline: 'Una meditación sobre el tiempo que pasa entre nosotras',
        synopsis: 'Un retrato íntimo de los pequeños rituales que construyen una vida. Una película que encuentra lo extraordinario en lo cotidiano, filmada con la delicadeza de quien sabe que los momentos más importantes son los que casi no se ven.',
        director_note: 'Quería capturar lo que se siente cuando un día ordinario se convierte en algo que recuerdas para siempre.',
        critic_rating: 4.0, audience_rating: 4.2, festival: 'Festival de San Sebastián Indie',
      };
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('movies').update({ ...movieData, phase: 4, completed_at: new Date().toISOString() }).eq('id', movieId);

    return new Response(JSON.stringify(movieData), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
