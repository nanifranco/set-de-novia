import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { answers, watchlist } = await req.json();

    const watchlistText = watchlist.length > 0
      ? `Su watchlist pendiente incluye: ${watchlist.map((m: any) => `"${m.title}"${m.director ? ` de ${m.director}` : ''}${m.genre ? ` (${m.genre})` : ''}`).join(', ')}.`
      : 'No tiene películas en su watchlist todavía.';

    const prompt = `Eres un asistente cinematográfico personal para María, estudiante de cine.

Sus respuestas de hoy:
- ¿Cómo te sientes? ${answers.mood}
- ¿Qué tipo de historia quieres? ${answers.story}
- ¿Con quién vas a ver? ${answers.company}

${watchlistText}

Recomienda UNA sola película. Si hay alguna de su watchlist que encaje perfectamente, priorízala. Si no, sugiere otra.
Responde en español, de forma cálida y breve (máximo 4 oraciones): nombre + director + año + por qué encaja con su estado de ánimo hoy.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content || 'No pude generar una recomendación. ¡Intenta de nuevo!';

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
