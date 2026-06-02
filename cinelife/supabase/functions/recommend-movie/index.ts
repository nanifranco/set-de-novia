import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { answers, watchlist } = await req.json();

    const pending = (watchlist || []).filter((m: any) => !m.watched).slice(0, 25);
    const watchlistStr = pending.length > 0
      ? pending.map((m: any) =>
          `- "${m.title}"${m.director ? ` (${m.director}` : ''}${m.year ? `, ${m.year}` : ''}${m.director || m.year ? ')' : ''}${m.genre ? ` — ${m.genre}` : ''}`
        ).join('\n')
      : '(watchlist vacía)';

    const prompt = `Eres Luz, una curadora de cine indie y festivales internacionales. Recomienda una película a María de manera personal y cálida.

Estado de ánimo de María hoy: ${answers.mood}
Tiempo disponible: ${answers.time}
Lo que busca sentir: ${answers.want}

Películas pendientes en su watchlist (da PRIORIDAD si alguna encaja perfectamente):
${watchlistStr}

Instrucciones:
- Si una película de la watchlist encaja con el estado de ánimo y lo que busca, recomiéndala.
- Si ninguna encaja bien, recomienda una película real que creas que María amaría.
- Sé personal, cálida y específica. Menciona algo concreto de la película que conecte con cómo se siente hoy.

Responde ÚNICAMENTE con JSON válido:
{"recommendation":"título exacto","is_from_watchlist":true,"director":"nombre","year":2024,"why":"3-4 oraciones muy personales sobre por qué esta película es perfecta para este momento exacto","where_to_watch":"plataforma o Justwatch","mood_match":"5-8 palabras que describen el feeling de la película"}`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.85, max_tokens: 500 }),
    });

    const data = await openaiRes.json();
    let result: Record<string, unknown>;
    try {
      result = JSON.parse(data.choices[0].message.content.trim());
    } catch {
      result = {
        recommendation: 'Aftersun', is_from_watchlist: false,
        director: 'Charlotte Wells', year: 2022,
        why: 'Aftersun te acompañará perfectamente hoy. Es una película sobre los momentos que no entendemos hasta que ya pasaron, filmada con una ternura que duele. Perfecta para cuando buscas sentir algo verdadero.',
        where_to_watch: 'MUBI', mood_match: 'íntima, melancólica, hermosa',
      };
    }

    return new Response(JSON.stringify(result), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
