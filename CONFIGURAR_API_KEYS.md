# 🔑 CONFIGURAÇÃO DAS API KEYS - IMPORTANTE!

## PASSO 1: Localizar o arquivo .env
Abra o arquivo `.env` na pasta `companion-ai`

## PASSO 2: Adicionar suas chaves

### 🤖 Chave do Gemini (Google AI)
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key" 
4. Copie a chave gerada
5. No arquivo `.env`, substitua:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Por:
   ```
   VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI
   ```

### 🌤️ Chave do OpenWeather
1. Acesse: https://openweathermap.org/api
2. Crie uma conta gratuita
3. Vá em "API Keys" no seu perfil
4. Copie sua chave
5. No arquivo `.env`, substitua:
   ```
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```
   Por:
   ```
   VITE_OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
   ```

## PASSO 3: Reiniciar o servidor
Após adicionar as chaves:
1. Pare o servidor (Ctrl+C)
2. Execute novamente: `npm run dev`

## ⚠️ IMPORTANTE
- NUNCA compartilhe suas API keys
- NUNCA faça commit do arquivo .env
- As chaves são GRATUITAS nos links acima