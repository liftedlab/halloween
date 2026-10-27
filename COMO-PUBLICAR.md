# Como colocar a lista no ar

## 1. Planilha que recebe os nomes (uns 5 min)
1. Crie uma planilha nova no Google Planilhas (ex.: "Lista Lifted Halloween").
2. Menu **Extensões > Apps Script**. Apague o que estiver lá e cole todo o conteúdo de `google-apps-script.js`. Salve (ícone de disquete).
3. Clique em **Implantar > Nova implantação**. Na engrenagem, escolha **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize com sua conta Google (vai aparecer um aviso de "app não verificado": clique em *Avançado > Acessar*, é o seu próprio script).
5. Copie o **URL do app da Web** (termina em `/exec`).
6. Abra `index.html` num editor de texto, procure `const SCRIPT_URL = "";` e cole o link entre as aspas.

Os nomes caem na aba **Lista**, com data, nome, @ e uma caixinha "Chegou?" pra marcar na porta.

## 2. Publicar no GitHub Pages (uns 5 min)
1. No GitHub: **New repository**, nome tipo `lifted-halloween`, deixe **Public**, crie.
2. Clique em **uploading an existing file** e arraste TUDO desta pasta (index.html, as pastas `fonts` e `img`). Commit.
3. **Settings > Pages**. Em *Branch*, escolha `main` e `/ (root)`, **Save**.
4. Em 1–2 minutos o link aparece no topo da página: `https://SEU-USUARIO.github.io/lifted-halloween/`

## 3. Testar
Abra o link no celular, assine com um nome de teste e confira se apareceu na planilha. Depois é só apagar a linha.

Se mudar o código do Apps Script depois, use **Implantar > Gerenciar implantações > editar (lápis) > Versão: nova versão**, senão o link continua rodando a versão antiga.
