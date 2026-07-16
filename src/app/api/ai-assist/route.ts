import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { keywords } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'La API Key de Groq no está configurada.' },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Modelo gratuito, potente y ultrarrápido
        messages: [
          {
            role: "system",
            content: `Eres un experto en redacción de productos para un catálogo boliviano de personalización (sublimación, láser). Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes ni después.`
          },
          {
            role: "user",
            content: `Redacta una descripción para este producto usando estas palabras clave: "${keywords}".
            Tono: cercano, profesional.
            Estructura estricta del JSON a devolver:
            {
              "description_long": "descripción larga y atractiva (2-3 líneas)",
              "description_short": "descripción corta (1 línea)",
              "tags": ["tag1", "tag2", "tag3", "tag4"]
            }`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
       return NextResponse.json({ error: data.error.message }, { status: 500 });
    }
    
    const textContent = data.choices[0].message.content;
    
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsedData);
    }

    return NextResponse.json({ error: 'Formato de respuesta inesperado' }, { status: 500 });

  } catch (error) {
    console.error('Error in AI Assist Route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
